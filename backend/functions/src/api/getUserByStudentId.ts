import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/**
 * getUserByStudentId
 * Finds a user where user.studentId == provided value
 */
export const getUserByStudentId = onRequest(
  { cors: true },
  (req, res): void => {
    (async () => {
      try {
        const studentId = req.query.studentId as string;

        if (!studentId) {
          res.status(400).json({
            success: false,
            message: "Missing parameter: studentId",
          });
          return;
        }

        logger.info(`Searching for user with studentId: ${studentId}`);

        const snapshot = await db
          .collection("users")
          .where("studentId", "==", studentId)
          .limit(1)
          .get();

        if (snapshot.empty) {
          res.status(404).json({
            success: false,
            message: `No user found with studentId ${studentId}`,
          });
          return;
        }

        const doc = snapshot.docs[0];

        res.status(200).json({
          success: true,
          item: {
            id: doc.id,
            ...doc.data(),
          },
        });
      } catch (error: any) {
        logger.error("Error fetching user:", error);

        res.status(500).json({
          success: false,
          error: error.message || error,
        });
      }
    })();
  }
);
