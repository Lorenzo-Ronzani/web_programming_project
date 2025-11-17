import { onRequest } from "firebase-functions/v2/https";
import * as fs from "fs";
import * as path from "path";
import * as logger from "firebase-functions/logger";
import { db } from "../config/firebase";

export const importPrograms = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      logger.info("Importing programs...");

      const filePath = path.join(__dirname, "../data/programs.json");
      const raw = fs.readFileSync(filePath, "utf8");
      const programs = JSON.parse(raw);

      const batch = db.batch();

      programs.forEach((program: any) => {
        const docRef = db.collection("programs").doc(program.id.toString());
        batch.set(docRef, program);
      });

      await batch.commit();

      logger.info("Programs imported successfully!");

      res.json({ message: "Programs imported successfully!" });
    } catch (error: any) {
      logger.error("Failed to import programs:", error);
      res.status(500).json({
        error: "Failed to import programs",
        details: error.message || error,
      });
    }
  }
);
