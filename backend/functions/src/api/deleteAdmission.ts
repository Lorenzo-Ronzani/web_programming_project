// ------------------------------------------------------
// deleteAdmission.ts - Delete an admission entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const deleteAdmission = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Only DELETE allowed" });
  }

  try {
    const id = req.query.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Admission ID is required",
      });
    }

    await db.collection("admissions").doc(id).delete();

    return res.status(200).json({
      success: true,
      message: "Admission deleted successfully",
    });

  } catch (error: any) {
    console.error("DELETE ADMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete admission",
    });
  }
});
