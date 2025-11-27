// ------------------------------------------------------
// getTuitionById.ts - Fetch tuition by ID
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getTuitionById = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Only GET allowed" });
  }

  try {
    const id = req.query.id;

    const snap = await db.collection("tuition").doc(id).get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: "Tuition not found" });
    }

    return res.status(200).json({
      success: true,
      item: { id, ...snap.data() },
    });

  } catch (error: any) {
    console.error("GET TUITION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tuition",
    });
  }
});
