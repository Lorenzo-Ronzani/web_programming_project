import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/**
 * Cloud Function: getCourses
 * Returns all courses from Firestore with CORS enabled.
 */
export const getCourses = onRequest(
  { cors: true },
  async (req, res): Promise<void> => {
    try {
      logger.info("Fetching courses from Firestore...");

      const snapshot = await db.collection("courses").get();

      const courses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      logger.info(`Fetched ${courses.length} courses successfully.`);

      res.status(200).json(courses);
    } catch (error: any) {
      logger.error("Error fetching courses:", error);
      res.status(500).json({
        error: "Failed to fetch courses from database",
        details: error.message || error,
      });
    }
  }
);
