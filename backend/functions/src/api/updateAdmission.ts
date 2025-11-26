// ------------------------------------------------------
// updateAdmission.ts - Update an admission entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updateAdmission = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Only PUT allowed" });
  }

  try {
    const { id, ...data } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Admission ID is required" });
    }

    await db.collection("admissions").doc(id).update({
      ...data,
      updated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Admission updated successfully",
    });

  } catch (error: any) {
    console.error("UPDATE ADMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update admission",
    });
  }
});
