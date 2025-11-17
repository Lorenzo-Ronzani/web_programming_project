import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/**
 * getUsers
 * Returns all users from Firestore
 */
export const getUsers = onRequest({ cors: true }, async (req, res) => {
  try {
    logger.info("Fetching users from Firestore...");

    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    logger.info(`Fetched ${users.length} users.`);

    res.status(200).json(users);
  } catch (error: any) {
    logger.error("Error fetching users:", error);

    res.status(500).json({
      error: "Failed to fetch users",
      details: error.message || error,
    });
  }
});
