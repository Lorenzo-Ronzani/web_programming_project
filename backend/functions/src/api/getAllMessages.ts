import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getAllMessages = onRequest(
  { cors: true },
  async (_req: any, res: any) => {
    try {
      const snap = await db
        .collection("contactForms")
        .orderBy("createdAt", "desc")
        .get();

      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      return res.status(200).json({
        success: true,
        items,
      });
    } catch (err: any) {
      console.error("ERROR getAllMessages:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to load messages",
      });
    }
  }
);
