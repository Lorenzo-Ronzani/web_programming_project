import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const deleteStudentCourses = onRequest(
  { cors: true },
  async (req: any, res: any) => {
    if (req.method !== "DELETE") {
      return res
        .status(405)
        .json({ success: false, message: "Only DELETE allowed" });
    }

    try {
      const id = req.query.id as string;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "StudentCourse ID is required",
        });
      }

      // Correct Firestore collection
      const ref = db.collection("studentCourses").doc(id);
      const snap = await ref.get();

      if (!snap.exists) {
        return res.status(404).json({
          success: false,
          message: "StudentCourse not found",
        });
      }

      await ref.delete();

      return res.status(200).json({
        success: true,
        message: "StudentCourse deleted successfully",
      });
    } catch (error: any) {
      console.error("DELETE STUDENTCOURSE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete studentCourse",
      });
    }
  }
);
