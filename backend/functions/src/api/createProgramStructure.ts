import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createProgramStructure = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    if (!data.program_id) {
      return res.status(400).json({
        success: false,
        message: "Missing program_id",
      });
    }

    // VALIDATION: Only one structure per program
    const existing = await db
      .collection("program_structure")
      .where("program_id", "==", data.program_id)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        success: false,
        message: "A structure for this program already exists.",
      });
    }

    // If no structure exists → create a new one
    const docRef = await db.collection("program_structure").add({
      ...data,
      created_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      id: docRef.id,
      message: "Program structure created successfully",
    });

  } catch (error: any) {
    console.error("CREATE PROGRAM STRUCTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create program structure",
    });
  }
});
