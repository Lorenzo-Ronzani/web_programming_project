// ------------------------------------------------------
// getTuition.ts - Fetch tuition entries 
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getTuition = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    const snap = await db.collection("tuition").get();

    const items = snap.docs.map((doc: any) => {
      const d = doc.data();

      // Normalize at read time (extra safety)
      return {
        id: doc.id,
        program_id: d.program_id,

        domestic: {
          estimated_total: Number(d.domestic?.estimated_total || 0),
          terms: Array.isArray(d.domestic?.terms) ? d.domestic.terms : [],
        },

        international: {
          estimated_total: Number(d.international?.estimated_total || 0),
          terms: Array.isArray(d.international?.terms) ? d.international.terms : [],
        },

        created_at: d.created_at,
        updated_at: d.updated_at,
      };
    });

    return res.status(200).json({ success: true, items });
  } catch (error: any) {
    console.error("GET TUITION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tuition",
    });
  }
});
