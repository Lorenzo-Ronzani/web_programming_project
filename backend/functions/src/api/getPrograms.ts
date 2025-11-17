import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/**
 * Cloud Function: getPrograms
 * Returns all programs from Firestore with CORS enabled.
 */
export const getPrograms = onRequest(
  { cors: true },
  async (req, res): Promise<void> => {
    try {
      logger.info("Fetching programs from Firestore...");

      const snapshot = await db.collection("programs").get();

      const programs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      logger.info(`Fetched ${programs.length} programs successfully.`);

      res.status(200).json(programs);
    } catch (error: any) {
      logger.error("Error fetching programs:", error);
      res.status(500).json({
        error: "Failed to fetch programs from database",
        details: error.message || error,
      });
    }
  }
);
