// src/firebase.js

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  connectAuthEmulator 
} from "firebase/auth";

import { 
  getFirestore, 
  connectFirestoreEmulator 
} from "firebase/firestore";

/*
  Firebase configuration loaded from environment variables.
  These variables must exist in .env.local during development,
  and in .env.production for deployed versions.
*/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/*
  Initialize Firebase application.
  This instance will be used to initialize Auth and Firestore.
*/
const app = initializeApp(firebaseConfig);

/*
  Firebase Authentication instance.
  Used for login, logout, register and Google sign-in.
*/
export const auth = getAuth(app);

/*
  Firestore database instance.
  Used to store user profiles and application data.
*/
export const db = getFirestore(app);

/*
  When running locally (localhost), connect both Auth and Firestore
  to the Firebase Emulator Suite.

  This prevents your local development environment from writing data
  to the real Firebase project.
*/

const useEmulator = import.meta.env.VITE_USE_EMULATOR === "true";

if (useEmulator) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "localhost", 8080);

  console.log("Using Firebase Auth Emulator at http://127.0.0.1:9099");
  console.log("Using Firestore Emulator at http://localhost:8080");
}


/*
  The 'app' instance is exported in case other Firebase services
  (such as Storage or Messaging) need to be initialized later.
*/
export default app;
