// ------------------------------------------------------
// updateRequirement.ts - Update a requirement entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updateRequirement = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Only PUT allowed" });
  }

  try {
    const { id, ...data } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Requirement ID is required" });
    }

    await db.collection("requirements").doc(id).update({
      ...data,
      updated_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Requirements updated successfully",
    });

  } catch (error: any) {
    console.error("UPDATE REQUIREMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update requirements",
    });
  }
});
