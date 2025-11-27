// ------------------------------------------------------
// createProgramStructure.ts - Create a program structure
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createProgramStructure = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

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
