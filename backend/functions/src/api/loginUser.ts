import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

/*
  loginUser
  --------------------------------------------------------------------
  This API handles user authentication using Firestore as the database.
  It validates:
    - required fields
    - username existence
    - password match
    - user active status

  It returns all user fields except the password.
*/
export const loginUser = onRequest(
  { cors: true },
  async (req, res): Promise<void> => {
    try {
      const { username, password } = req.body;

      // Validate required fields
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: "Username and password are required.",
        });
        return;
      }

      logger.info(`Login attempt received for: ${username}`);

      // Query Firestore to find the user by username
      const snapshot = await db
        .collection("users")
        .where("username", "==", username)
        .limit(1)
        .get();

      // No user with this username
      if (snapshot.empty) {
        logger.warn(`User not found: ${username}`);
        res.status(401).json({
          success: false,
          message: "Invalid username or password.",
        });
        return;
      }

      const userData = snapshot.docs[0].data();

      // Compare password (plaintext because your JSON uses plaintext)
      if (userData.password !== password) {
        logger.warn(`Invalid password for: ${username}`);
        res.status(401).json({
          success: false,
          message: "Invalid username or password.",
        });
        return;
      }

      // User status validation
      if (userData.status !== "active") {
        logger.warn(`Inactive user attempted login: ${username}`);
        res.status(403).json({
          success: false,
          message: "Your account is inactive. Please contact the administrator.",
        });
        return;
      }

      logger.info(`Login successful for: ${username}`);

      // Remove password before returning user data
      const { password: removedPassword, ...userWithoutPassword } = userData;

      // Successful response
      res.status(200).json({
        success: true,
        message: "Login successful.",
        user: userWithoutPassword,
      });
    } catch (error: any) {
      logger.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error.",
        details: error.message,
      });
    }
  }
);
