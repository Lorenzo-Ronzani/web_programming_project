import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";
import usersData from "../data/users.json";

/**
 * importUsers
 * Importa todos os usuários do arquivo users.json
 * Cria/atualiza documentos na coleção "users"
 * Doc ID = student_id
 */
export const importUsers = onRequest(
  { cors: true },
  async (req, res): Promise<void> => {
    try {
      logger.info("Starting importUsers...");

      if (!Array.isArray(usersData)) {
        logger.error("users.json is not an array");
        res.status(400).json({
          error: "Invalid format. Expected an array.",
        });
        return;
      }

      const batch = db.batch();
      let count = 0;

      for (const user of usersData) {
        const studentId = user.student_id;

        if (!studentId) {
          logger.warn("Skipping user without student_id:", user);
          continue;
        }

        const docRef = db.collection("users").doc(String(studentId));

        batch.set(docRef, {
          ...user,  
        });

        count++;
      }

      await batch.commit();

      logger.info(`Successfully imported ${count} users.`);
      res.status(200).json({
        message: "Users imported successfully",
        totalImported: count,
      });
    } catch (error: any) {
      logger.error("Error importing users:", error);
      res.status(500).json({
        error: "Failed to import users",
        details: error.message || error,
      });
    }
  }
);
