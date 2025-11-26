// ------------------------------------------------------
// getAdmissionById.ts - Get a single admission
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getAdmissionById = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    // Allow only GET
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Only GET method allowed",
      });
    }

    const id = req.query.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Admission ID is required",
      });
    }

    const doc = await db.collection("admissions").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    return res.status(200).json({
      success: true,
      item: { id: doc.id, ...doc.data() },
    });

  } catch (error: any) {
    console.error("GET ADMISSION BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admission",
    });
  }
});

