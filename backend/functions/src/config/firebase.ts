import * as admin from "firebase-admin";

// Initialize Firebase Admin ONLY ONCE here
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
