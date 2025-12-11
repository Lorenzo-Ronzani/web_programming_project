// ------------------------------------------------------
// registerProgram.ts
// Registers a student into a program
// Validations:
// 1. Student can have only ONE active program
// 2. Cannot register twice into the same program (unless withdrawn/completed)
// 3. Program must exist
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const registerProgram = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    // ------------------------------------------------------
    // 0. Method validation
    // ------------------------------------------------------
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const { student_id, program_id } = req.body;

    if (!student_id || !program_id) {
      return res.status(400).json({
        success: false,
        message: "Missing student_id or program_id",
      });
    }

    // ------------------------------------------------------
    // 1. Check if student already has an ACTIVE program
    // ------------------------------------------------------
    const activeSnapshot = await db
      .collection("studentPrograms")
      .where("student_id", "==", student_id)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (!activeSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "Student already has an active program.",
      });
    }

    // ------------------------------------------------------
    // 2. (Extra safety) Check if student already registered
    //    in the SAME program with any status other than withdrawn
    // ------------------------------------------------------
    const sameProgramSnapshot = await db
      .collection("studentPrograms")
      .where("student_id", "==", student_id)
      .where("program_id", "==", program_id)
      .where("status", "!=", "withdrawn")
      .limit(1)
      .get();

    if (!sameProgramSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "Student is already registered in this program.",
      });
    }

    // ------------------------------------------------------
    // 3. Load program document
    // ------------------------------------------------------
    const programDoc = await db.collection("programs").doc(program_id).get();

    if (!programDoc.exists) {
      return res.status(400).json({
        success: false,
        message: "Program not found.",
      });
    }

    const programData = programDoc.data() || {};

    // We try a few common field names for title and credential
    const program_title =
      programData.title ||
      programData.name ||
      programData.program_title ||
      "Unknown program";

    const credential =
      programData.credential ||
      programData.credential_type ||
      programData.award ||
      "Unknown";

    // ------------------------------------------------------
    // 4. Initial term configuration
    // ------------------------------------------------------
    const current_term_index = 0; // always start on Term 1
    const current_term_label = "Term 1";

    const now = new Date().toISOString();

    const newData = {
      student_id,
      program_id,
      program_title,
      credential,

      current_term_index,
      current_term: current_term_label,  // kept for compatibility
      current_term_label,

      status: "active",

      created_at: now,
      updated_at: now,
    };

    // ------------------------------------------------------
    // 5. Create studentPrograms document
    // ------------------------------------------------------
    const newDoc = await db.collection("studentPrograms").add(newData);

    return res.status(200).json({
      success: true,
      item: {
        id: newDoc.id,
        ...newData,
      },
    });
  } catch (error: any) {
    console.error("REGISTER PROGRAM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register program",
    });
  }
});
