import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const updateCourse = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Only PUT allowed" });
  }

  try {
    const { id, ...data } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    const payload = {
      code: data.code,                       // AGORA ATUALIZA
      title: data.title,
      instructor: data.instructor || "",
      photo: data.photo || "",
      details: data.details || "",           // NOVO CAMPO
      color: data.color || "indigo",
      icon: data.icon || "school",
      credits: Number(data.credits || 0),
      is_active: data.is_active ?? true,
      show_on_homepage: data.show_on_homepage ?? false,
      updated_at: new Date(),
    };

    await db.collection("courses").doc(id).update(payload);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
    });

  } catch (error: any) {
    console.error("UPDATE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update course",
    });
  }
});
