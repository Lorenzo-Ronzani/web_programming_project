import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

/**
 * updateMessageStatus
 *
 * Method: POST
 * Body (JSON):
 * {
 *   messageId: string,           // required
 *   status?: "answered",         // optional (default = answered)
 *   reply: string                // REQUIRED when status === "answered"
 * }
 *
 * Notes:
 * - Manual JSON parsing via req.rawBody (Cloud Functions v2 safe)
 * - reply is mandatory when answering
 */
export const updateMessageStatus = onRequest(
  { cors: true },
  async (req: any, res: any) => {
    try {
      // --------------------------------------------------
      // Method validation
      // --------------------------------------------------
      if (req.method !== "POST") {
        return res.status(405).json({
          success: false,
          message: "Only POST allowed",
        });
      }

      // --------------------------------------------------
      // Safe JSON parsing (Functions v2)
      // --------------------------------------------------
      let body: any = {};
      try {
        const raw = req.rawBody?.toString("utf8") || "";
        body = raw ? JSON.parse(raw) : {};
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON body",
        });
      }

      const messageId = body?.messageId;
      const status = body?.status ?? "answered";
      const reply = body?.reply;

      // --------------------------------------------------
      // Validate messageId
      // --------------------------------------------------
      if (!messageId || typeof messageId !== "string") {
        return res.status(400).json({
          success: false,
          message: "messageId is required",
        });
      }

      // --------------------------------------------------
      // Validate status
      // --------------------------------------------------
      if (status !== "answered") {
        return res.status(400).json({
          success: false,
          message: "Only status 'answered' is supported by this endpoint",
        });
      }

      // --------------------------------------------------
      // Validate reply (REQUIRED)
      // --------------------------------------------------
      if (
        typeof reply !== "string" ||
        reply.trim().length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "reply is required when answering a message",
        });
      }

      // --------------------------------------------------
      // Load message
      // --------------------------------------------------
      const ref = db.collection("contactForms").doc(messageId);
      const snap = await ref.get();

      if (!snap.exists) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // --------------------------------------------------
      // Update Firestore
      // --------------------------------------------------
      await ref.update({
        status: "answered",
        reply: reply.trim(),
        answeredAt: new Date().toISOString(),
      });

      // --------------------------------------------------
      // Success
      // --------------------------------------------------
      return res.status(200).json({
        success: true,
        message: "Message answered successfully",
      });
    } catch (err: any) {
      console.error("updateMessageStatus error:", err);
      return res.status(500).json({
        success: false,
        message: err?.message || "Internal server error",
      });
    }
  }
);
