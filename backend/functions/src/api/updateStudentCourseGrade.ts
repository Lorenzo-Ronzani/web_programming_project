import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Request, Response } from "express";

const db = admin.firestore();

export const updateStudentCourseGrade = onRequest(
  { cors: true },
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ success: false, message: "Only POST allowed" });
        return;
      }

      const { id, numeric_grade, letter_grade, grade_points, completed } = req.body;

      if (!id) {
        res.status(400).json({ success: false, message: "Missing document id." });
        return;
      }

      await db.collection("studentCourses").doc(id).update({
        numeric_grade,
        letter_grade,
        grade_points,
        completed,
        status: completed ? "completed" : "registered",
        updated_at: new Date().toISOString(),
      });

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("UPDATE STUDENT COURSE ERROR:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
);
