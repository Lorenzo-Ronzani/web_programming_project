// ------------------------------------------------------
// getTuition.ts - List all tuition entries
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getTuition = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    const snap = await db.collection("tuition").get();
    const items = snap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ success: true, items });

  } catch (error: any) {
    console.error("GET TUITION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tuition",
    });
  }
});
