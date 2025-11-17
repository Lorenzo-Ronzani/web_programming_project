import { onRequest } from "firebase-functions/v2/https";
import * as fs from "fs";
import * as path from "path";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

export const importCourses = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      logger.info("Importing courses...");

      const filePath = path.join(__dirname, "../data/courses.json");
      const raw = fs.readFileSync(filePath, "utf8");
      const courses = JSON.parse(raw);

      const batch = db.batch();

      courses.forEach((course: any) => {
        const docRef = db.collection("courses").doc(course.id.toString());
        batch.set(docRef, course);
      });

      await batch.commit();

      logger.info("Courses imported successfully!");

      res.json({ message: "Courses imported successfully!" });
    } catch (error: any) {
      logger.error("Failed to import courses:", error);
      res.status(500).json({
        error: "Failed to import courses",
        details: error.message || error,
      });
    }
  }
);
