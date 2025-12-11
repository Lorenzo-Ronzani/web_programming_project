import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/**
 * getCoursesUsers
 * Returns course enrollment data for all students
 */
export const getCoursesUsers = onRequest({ cors: true }, async (req, res) => {
  try {
    logger.info("Fetching enrolled courses from Firestore...");

    const snapshot = await db.collection("studentCourses").get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    logger.info(`Fetched ${data.length} course-enrolled records.`);

    res.status(200).json(data);
  } catch (error: any) {
    logger.error("Error fetching studentCourses:", error);

    res.status(500).json({
      error: "Failed to fetch student's enrolled courses",
      details: error.message || error,
    });
  }
});
