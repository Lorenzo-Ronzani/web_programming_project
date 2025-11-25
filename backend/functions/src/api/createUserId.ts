// ------------------------------------------------------
// onUserCreated.ts
// Firestore trigger to automatically generate a sequential studentId
// whenever a new user document is created in the "users" collection.
// ------------------------------------------------------

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "../config/firebaseAdmin"; // Centralized Firebase Admin initialization

export const assignStudentId = onDocumentCreated("users/{uid}", async (event) => {
  const userRef = event.data?.ref;
  const userData = event.data?.data();

  if (!userRef || !userData) {
    console.error("assignStudentId: Missing user reference or user data.");
    return;
  }

  // If the user already has a studentId, do nothing
  if (userData.studentId) {
    console.log("assignStudentId: studentId already exists:", userData.studentId);
    return;
  }

  const db = admin.firestore();

  try {
    // Step 1: Retrieve the highest existing studentId in the collection
    const snapshot = await db
      .collection("users")
      .orderBy("studentId", "desc")
      .limit(1)
      .get();

    let nextNumber = 1;

    // If a previous studentId exists, increment it
    if (!snapshot.empty) {
      const lastId = snapshot.docs[0].data().studentId;

      if (lastId) {
        nextNumber = parseInt(lastId.replace("ST", "")) + 1;
      }
    }

    // Step 2: Format the new studentId (example: ST000001)
    const newStudentId = "ST" + nextNumber.toString().padStart(6, "0");

    // Step 3: Update the newly created user document with the generated studentId
    await userRef.update({
      studentId: newStudentId,
    });

    console.log("assignStudentId: studentId generated:", newStudentId);

  } catch (error) {
    console.error("assignStudentId: Error generating studentId:", error);
  }
});
