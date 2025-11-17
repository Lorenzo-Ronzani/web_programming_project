import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";
import coursesEnrolled from "../data/courses_enrolled.json";

export const importCoursesEnrolled = onRequest(
  { cors: true },
  async (req, res): Promise<void> => {
    try {
      logger.info("Starting import of courses_enrolled...");

      if (!Array.isArray(coursesEnrolled)) {
        logger.error("courses_enrolled.json must be an array.");
        res.status(400).json({
          error: "Invalid JSON format. Expected an array of objects.",
        });
        return;
      }

      const batch = db.batch();
      let count = 0;

      for (const entry of coursesEnrolled) {
        const studentId = entry.student_id;

        if (!studentId) {
          logger.warn("Skipping entry without student_id:", entry);
          continue;
        }

        const docRef = db.collection("courses_enrolled").doc(studentId);

        batch.set(docRef, {
          student_id: studentId,
          courses: entry.courses || [],
        });

        count++;
      }

      await batch.commit();

      logger.info(`Imported ${count} enrollments successfully.`);
      res.status(200).json({
        message: "Enrollments imported successfully.",
        studentsImported: count,
      });
    } catch (error: any) {
      logger.error("Error importing enrollments:", error);
      res.status(500).json({
        error: "Failed to import enrollments",
        details: error.message || error,
      });
    }
  }
);
