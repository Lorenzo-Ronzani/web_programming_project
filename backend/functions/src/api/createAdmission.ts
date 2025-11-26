// ------------------------------------------------------
// createAdmission.ts - Create a new admission entry
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createAdmission = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    if (!data?.title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const admission = {
      title: data.title || "",
      requirements: data.requirements || [],
      transferability: data.transferability || "",
      language_proficiency: data.language_proficiency || "",
      academic_upgrading: data.academic_upgrading || "",
      created_at: new Date(),
    };

    const ref = await db.collection("admissions").add(admission);

    return res.status(200).json({
      success: true,
      id: ref.id,
      data: admission,
    });

  } catch (error: any) {
    console.error("CREATE ADMISSION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create admission",
    });
  }
});
