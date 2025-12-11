// ------------------------------------------------------
// getStudentProgram.ts
// Fetches the student's active program registration
// Query: ?student_id=123
// ------------------------------------------------------
import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getStudentProgram = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    const student_id = req.query.student_id;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "Missing student_id parameter",
      });
    }

    const snapshot = await db
      .collection("studentPrograms")
      .where("student_id", "==", student_id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        item: null,
      });
    }

    const doc = snapshot.docs[0];

    return res.status(200).json({
      success: true,
      item: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error: any) {
    console.error("GET STUDENT PROGRAM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student program",
    });
  }
});
