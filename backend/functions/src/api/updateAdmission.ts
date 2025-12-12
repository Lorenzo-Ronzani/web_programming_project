import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updateAdmission = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Only PUT requests are allowed",
    });
  }

  try {
    const { id, program_id, ...data } = req.body;

    // Validate required ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Admission ID is required",
      });
    }

    // Load the existing admission to preserve the current program_id
    const existingDoc = await db.collection("admissions").doc(id).get();

    if (!existingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    const currentProgramId = existingDoc.data()?.program_id;

    if (!currentProgramId) {
      return res.status(400).json({
        success: false,
        message: "Existing admission has no program_id stored",
      });
    }

    // Normalize requirements into an array
    const normalizedRequirements = Array.isArray(data.requirements)
      ? data.requirements
      : String(data.requirements || "")
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

    // Data to be updated
    const payload = {
      program_id: currentProgramId, // program cannot be changed once created
      title: data.title || "",
      requirements: normalizedRequirements,
      transferability: data.transferability || "",
      language_proficiency: data.language_proficiency || "",
      academic_upgrading: data.academic_upgrading || "",
      updated_at: new Date(),
    };

    // Firestore update
    await db.collection("admissions").doc(id).update(payload);

    return res.status(200).json({
      success: true,
      message: "Admission updated successfully",
    });

  } catch (error: any) {
    console.error("UPDATE ADMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the admission",
    });
  }
});
