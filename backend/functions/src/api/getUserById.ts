import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

export const getUserById = onRequest(
  { cors: true },
  (req, res): void => {
    (async () => {
      try {
        const id = req.query.id as string;

        if (!id) {
          res.status(400).json({
            success: false,
            message: "Missing parameter: id",
          });
          return;
        }

        logger.info(`Fetching user with ID: ${id}`);

        const doc = await db.collection("users").doc(id).get();

        if (!doc.exists) {
          res.status(404).json({
            success: false,
            message: `User with ID ${id} not found`,
          });
          return;
        }

        res.status(200).json({
          success: true,
          item: { id: doc.id, ...doc.data() },
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
