// ------------------------------------------------------
// getProgramStructure.ts - List all program structures
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getProgramStructure = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    const snap = await db.collection("program_structure").get();

    const items = snap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ success: true, items });

  } catch (error: any) {
    console.error("GET PROGRAM STRUCTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch program structure",
    });
  }
});
