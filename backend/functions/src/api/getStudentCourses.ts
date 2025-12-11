// ------------------------------------------------------
// getStudentCourses.ts
// Returns all course registrations for a specific student
// Query: student_id=XYZ
// ------------------------------------------------------

import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";

export const getStudentCourses = onRequest({ cors: true }, async (req: any, res: any) => {
  try {
    const student_id = req.query.student_id;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "Missing student_id parameter.",
      });
    }

    const snapshot = await db
      .collection("studentCourses")
      .where("student_id", "==", student_id)
      .get();

    const items = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      items,
    });

  } catch (error: any) {
    console.error("GET STUDENT COURSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student's courses.",
    });
  }
});
