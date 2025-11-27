// ------------------------------------------------------
// updateProgramStructure.ts - Update a program structure
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updateProgramStructure = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Only PUT allowed" });
  }

  try {
    const { id, ...data } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Program structure ID is required",
      });
    }

    await db.collection("program_structure").doc(id).update({
      ...data,
      updated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Program structure updated successfully",
    });

  } catch (error: any) {
    console.error("UPDATE PROGRAM STRUCTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update structure",
    });
  }
});
