import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updatePublicIntake = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Only PUT allowed" });
  }

  try {
    const { id, ...data } = req.body;

    await db.collection("public_intakes").doc(id).update({
      ...data,
      updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      message: "Public intake updated successfully"
    });

  } catch (error: any) {
    console.error("UPDATE PUBLIC INTAKE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
