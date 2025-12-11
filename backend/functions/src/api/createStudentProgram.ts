// ------------------------------------------------------
// createStudentProgram.ts
// Registers a student into a program
// Body: student_id, program_id, current_term
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createStudentProgram = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
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
        message: "Missing required fields: student_id or program_id",
      });
    }

    // Check if student already has a program assigned
    const snapshot = await db
      .collection("studentPrograms")
      .where("student_id", "==", student_id)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "Student already has a registered program",
      });
    }

    // Validate program exists
    const programDoc = await db.collection("programs").doc(program_id).get();

    if (!programDoc.exists) {
      return res.status(400).json({
        success: false,
        message: "Program not found",
      });
    }


    const newData = {
        student_id,
        program_id,
        program_title: programDoc.data()!.title,
        credential: programDoc.data()!.credential || "",
        current_term: "Term 1",
        status: "active",
        created_at: new Date().toISOString(),
    };


    const docRef = await db.collection("studentPrograms").add(newData);

    return res.status(200).json({
      success: true,
      item: {
        id: docRef.id,
        ...newData,
      },
    });
  } catch (error: any) {
    console.error("CREATE STUDENT PROGRAM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create student program",
    });
  }
});
