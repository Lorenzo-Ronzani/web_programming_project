// ------------------------------------------------------
// createUser.ts - Creates a Firebase Auth + Firestore user
// ------------------------------------------------------

import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const createUser = onRequest({ cors: true }, async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Only POST requests allowed" });
    return;
  }

  try {
    const { email, password, firstName, lastName, role = "student" } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const uid = userRecord.uid;

    await admin.firestore().collection("users").doc(uid).set({
      username: email,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      role,
      status: "active",
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      uid,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);

    if (error.code === "auth/email-already-exists") {
      res.status(409).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Unexpected server error",
    });
  }
});
