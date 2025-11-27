// ------------------------------------------------------
// createProgram.ts - Create a new program
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

// Extracts the first numeric value from a text.
// Example: "4 Terms" -> 4
function extractNumber(text: any): number {
  if (!text) return 0;
  const match = String(text).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export const createProgram = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    // Normalized payload
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
      created_at: new Date(),
    };

    const ref = await db.collection("programs").add(payload);

    return res.status(200).json({
      success: true,
      id: ref.id,
      message: "Program created successfully",
    });

  } catch (error: any) {
    console.error("CREATE PROGRAM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create program",
    });
  }
});
