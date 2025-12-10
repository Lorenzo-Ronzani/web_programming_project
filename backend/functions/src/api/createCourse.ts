// ------------------------------------------------------
// createCourse.ts - Create a new course
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const createCourse = onRequest({ cors: true }, async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    if (!data.code || !data.title) {
      return res.status(400).json({
        success: false,
        message: "Course code and title are required",
      });
    }

    const payload = {
      code: data.code,
      title: data.title,
      instructor: data.instructor || "",
      photo: data.photo || "",
      color: data.color || "indigo",
      icon: data.icon || "school",
      credits: Number(data.credits || 0),
      is_active: data.is_active ?? true,
      show_on_homepage: data.show_on_homepage ?? false,
      details: data.details || "",
      created_at: new Date(),
    };

    const ref = await db.collection("courses").add(payload);

    return res.status(200).json({
      success: true,
      id: ref.id,
      message: "Course created successfully",
    });

  } catch (error: any) {
    console.error("CREATE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
});
