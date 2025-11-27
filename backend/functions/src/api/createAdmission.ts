// ------------------------------------------------------
// createAdmission.ts - Create a new admission entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createAdmission = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST requests are allowed",
    });
  }

  try {
    const data = req.body;

    // Validate program_id
    if (!data.program_id) {
      return res.status(400).json({
        success: false,
        message: "program_id is required",
      });
    }

    // Normalize requirements into an array
    const normalizedRequirements = Array.isArray(data.requirements)
      ? data.requirements
      : String(data.requirements || "")
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

    // Payload to store in Firestore
    const payload = {
      program_id: data.program_id,
      title: data.title || "",
      requirements: normalizedRequirements,
      transferability: data.transferability || "",
      language_proficiency: data.language_proficiency || "",
      academic_upgrading: data.academic_upgrading || "",
      created_at: new Date(),
    };

    // Save document
    const ref = await db.collection("admissions").add(payload);

    return res.status(200).json({
      success: true,
      id: ref.id,
      message: "Admission created successfully",
    });

  } catch (error: any) {
    console.error("CREATE ADMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the admission",
    });
  }
});
