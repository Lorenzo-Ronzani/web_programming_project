import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createRequirement = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    // VALIDATION: Only one requirement per program
    const existing = await db
      .collection("requirements")
      .where("program_id", "==", data.program_id)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        success: false,
        message: "A requirement for this program already exists.",
      });
    }

    const ref = await db.collection("requirements").add({
      ...data,
      created_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      id: ref.id,
      message: "Requirements created successfully",
    });

  } catch (error: any) {
    console.error("CREATE REQUIREMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create requirements",
    });
  }
});
