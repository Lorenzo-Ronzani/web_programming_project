// ------------------------------------------------------
// deleteTuition.ts - Delete tuition entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const deleteTuition = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Only DELETE allowed" });
  }

  try {
    const id = req.query.id;

    await db.collection("tuition").doc(id).delete();

    return res.status(200).json({
      success: true,
      message: "Tuition deleted successfully",
    });

  } catch (error: any) {
    console.error("DELETE TUITION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete tuition",
    });
  }
});
