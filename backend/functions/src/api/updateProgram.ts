// ------------------------------------------------------
// updateProgram.ts - Update a program entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

// Extracts the first numeric value from a text.
function extractNumber(text: any): number {
  if (!text) return 0;
  const match = String(text).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export const updateProgram = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Only PUT allowed" });
  }

  try {
    const data = req.body;
    const id = data.id;

    if (!id) {
      return res.status(400).json({ success: false, message: "Program ID is required" });
    }

    // Build normalized update payload
    const payload = {
      title: data.title || "",
      credential: data.credential || "",
      program_length: extractNumber(data.program_length),
      area: data.area || "",
      school: data.school || "",
      color: data.color || "",
      icon: data.icon || "",
      duration: data.duration || "",
      description: data.description || "",
      updated_at: new Date(),
    };

    await db.collection("programs").doc(id).update(payload);

    return res.status(200).json({
      success: true,
      message: "Program updated successfully",
    });

  } catch (error: any) {
    console.error("UPDATE PROGRAM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update program",
    });
  }
});
