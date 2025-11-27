import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createPublicIntake = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    const ref = await db.collection("public_intakes").add({
      ...data,
      created_at: new Date()
    });

    return res.status(200).json({
      success: true,
      id: ref.id,
      message: "Public intake created successfully"
    });

  } catch (error: any) {
    console.error("CREATE PUBLIC INTAKE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
