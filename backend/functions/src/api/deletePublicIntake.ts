import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const deletePublicIntake = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Only DELETE allowed" });
  }

  try {
    const id = req.query.id;
    await db.collection("public_intakes").doc(id).delete();

    return res.status(200).json({
      success: true,
      message: "Public intake deleted successfully"
    });

  } catch (error: any) {
    console.error("DELETE PUBLIC INTAKE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
