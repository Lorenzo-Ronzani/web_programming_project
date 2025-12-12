import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getStudentMessages = onRequest(
  { cors: true },
  async (req: any, res: any) => {
    try {
      const studentId = req.query.studentId;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "studentId is required",
        });
      }

      const snap = await db
        .collection("contactForms")
        .where("studentId", "==", studentId)
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
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to load messages",
      });
    }
  }
);
