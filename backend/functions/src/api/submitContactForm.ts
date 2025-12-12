import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";


export const submitContactForm = onRequest(
  { cors: true },
  async (req: any, res: any) => {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ success: false, message: "Only POST allowed" });
    }

    try {
      const { studentId, name, email, subject, message } = req.body;

      if (!studentId || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      await db.collection("contactForms").add({
        studentId,
        name: name || "",
        email: email || "",
        subject,
        message,
        status: "unread",
        createdAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: "Message submitted successfully",
      });
    } catch (err: any) {
      console.error("ERROR submitContactForm:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to submit contact form",
      });
    }
  }
);
