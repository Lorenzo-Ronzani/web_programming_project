// ------------------------------------------------------
// createTuition.ts - Create tuition entry 
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createTuition = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    // Enforce required fields
    if (!data.program_id) {
      return res.status(400).json({ success: false, message: "program_id is required" });
    }

    // Only one tuition per program
    const existing = await db
      .collection("tuition")
      .where("program_id", "==", data.program_id)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        success: false,
        message: "A tuition for this program already exists.",
      });
    }

    // Normalize and enforce structure
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

      created_at: new Date(),
    };

    const ref = await db.collection("tuition").add(formatted);

    return res.status(200).json({
      success: true,
      id: ref.id,
      message: "Tuition created successfully",
    });
  } catch (error: any) {
    console.error("CREATE TUITION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create tuition",
    });
  }
});
