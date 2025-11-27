// ------------------------------------------------------
// deleteProgramStructure.ts - Delete a program structure
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const deleteProgramStructure = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Only DELETE allowed" });
  }

  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Program structure ID is required",
      });
    }

    await db.collection("program_structure").doc(id).delete();

    return res.status(200).json({
      success: true,
      message: "Program structure deleted successfully",
    });

  } catch (error: any) {
    console.error("DELETE PROGRAM STRUCTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete structure",
    });
  }
});
