// ------------------------------------------------------
// updateTuition.ts - Update a tuition entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updateTuition = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Only PUT allowed" });
  }

  try {
    const { id, ...data } = req.body;

    await db.collection("tuition").doc(id).update({
      ...data,
      updated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Tuition updated successfully",
    });

  } catch (error: any) {
    console.error("UPDATE TUITION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update tuition",
    });
  }
});
