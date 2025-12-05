// ------------------------------------------------------
// getTuitionById.ts - Fetch single tuition entry 
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getTuitionById = onRequest(
  { cors: true },
  async (req: any, res: any) => {
    if (req.method !== "GET") {
      return res
        .status(405)
        .json({ success: false, message: "Only GET allowed" });
    }

    try {
      const id = req.query.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Missing id parameter",
        });
      }

      const snap = await db.collection("tuition").doc(id).get();

      if (!snap.exists) {
        return res.status(404).json({
          success: false,
          message: "Tuition not found",
        });
      }

      // Safe fallback to ensure d is always an object
      const d = snap.data() || {};

      // ------------------------------------------------------
      // Normalized structure
      // Ensures that frontend always receives consistent data
      // ------------------------------------------------------
      const normalized = {
        id,
        program_id: d.program_id || null,

        domestic: {
          estimated_total: Number(d.domestic?.estimated_total || 0),
          terms: Array.isArray(d.domestic?.terms) ? d.domestic.terms : [],
        },

        international: {
          estimated_total: Number(d.international?.estimated_total || 0),
          terms: Array.isArray(d.international?.terms)
            ? d.international.terms
            : [],
        },

        created_at: d.created_at || null,
        updated_at: d.updated_at || null,
      };

      return res.status(200).json({
        success: true,
        item: normalized,
      });
    } catch (error: any) {
      console.error("GET TUITION BY ID ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch tuition",
      });
    }
  }
);
