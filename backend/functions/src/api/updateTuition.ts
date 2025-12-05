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

    if (!id) {
      return res.status(400).json({ success: false, message: "id is required" });
    }

    // Normalize object
    const formatted = {
      program_id: data.program_id,

      domestic: {
        estimated_total: Number(data.domestic?.estimated_total || 0),
        terms: Array.isArray(data.domestic?.terms) ? data.domestic.terms : [],
      },

      international: {
        estimated_total: Number(data.international?.estimated_total || 0),
        terms: Array.isArray(data.international?.terms) ? data.international.terms : [],
      },

      updated_at: new Date(),
    };

    await db.collection("tuition").doc(id).update(formatted);

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
