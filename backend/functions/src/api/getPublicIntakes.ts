import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getPublicIntakes = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    const snap = await db.collection("public_intakes").get();
    const items = snap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    return res.status(200).json({ success: true, items });
  } catch (error: any) {
    console.error("GET PUBLIC INTAKES ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
