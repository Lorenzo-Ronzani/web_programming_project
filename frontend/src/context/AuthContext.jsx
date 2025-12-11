import React, { createContext, useState, useContext, useEffect } from "react";

import { auth, db } from "../firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { buildApiUrl } from "../api";

/*
  Authentication Context: wlomazzi
  ----------------------------------------------------
  Provides:
    - Firebase login (Email/Password and Google OAuth)
    - Legacy backend login
    - Firestore user profile creation and updating
    - Local session persistence
*/
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  /*
    Restore currentUser from localStorage on app load.
  */
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    setUser(saved ? JSON.parse(saved) : null);
    setLoading(false);
  }, []);

  /*
    Legacy backend login (via Cloud Function)
  */
  const login = async (username, password) => {
    try {
      const response = await fetch(buildApiUrl("loginUser"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, message: result.message };
      }

      setUser(result.user);
      localStorage.setItem("currentUser", JSON.stringify(result.user));

      return { success: true, user: result.user };
    } catch {
      return {
        success: false,
        message: "Unable to reach authentication server.",
      };
    }
  };

  /*
    Helper that checks if user profile has missing required fields.
  */
  const isProfileIncomplete = (profile) => {
    return (
      !profile.phone ||
      !profile.addressNumber ||
      !profile.streetName ||
      !profile.city ||
      !profile.postalCode ||
      !profile.province
    );
  };

  /*
    Firebase login using Email + Password
    Ensures profile exists and checks completeness
  */
  const loginWithEmailAndPassword = async (email, password) => {
    try {
      // Sign in with Firebase Auth
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      const userRef = doc(db, "users", firebaseUser.uid);
      let snapshot = await getDoc(userRef);

      // If profile is missing → create a new one
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          username: email,
          firstName: "",
          lastName: "",
          role: "student",
          status: "active",
          photo: null,
          createdAt: new Date(),

          // required fields
          phone: "",
          addressNumber: "",
          streetName: "",
          city: "",
          postalCode: "",
          province: "",
        });

        snapshot = await getDoc(userRef);
      }

      const profile = snapshot.data();
      const incomplete = isProfileIncomplete(profile);

      // Save user session locally
      setUser(profile);
      localStorage.setItem("currentUser", JSON.stringify(profile));

      return {
        success: true,
        user: profile,
        requiresProfile: incomplete,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /*
    Google login 
  */
  const loginWithGoogle = async () => {

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userRef = doc(db, "users", firebaseUser.uid);
      let snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        const names = firebaseUser.displayName?.split(" ") ?? [];

        await setDoc(userRef, {
          username: firebaseUser.email,
          firstName: names[0] ?? "",
          lastName: names[1] ?? "",
          role: "student",
          status: "active",
          photo: firebaseUser.photoURL,
          createdAt: new Date(),

          // required fields
          phone: "",
          addressNumber: "",
          streetName: "",
          city: "",
          postalCode: "",
          province: "",
        });

        snapshot = await getDoc(userRef);
      }

      const profile = snapshot.data();
      const incomplete = isProfileIncomplete(profile);

      setUser(profile);
      localStorage.setItem("currentUser", JSON.stringify(profile));

      return {
        success: true,
        requiresProfile: incomplete,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /*
    Update Firestore user profile + local state
  */
  const updateUserProfile = async (data) => {
    try {
      if (!auth.currentUser) {
        return { success: false, message: "No authenticated user." };
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, data);

      const updatedUser = { ...user, ...data };

      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /*
    Logout user and clear session
  */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      console.warn("Failed to sign out from Firebase.");
    }

    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithEmailAndPassword,
        loginWithGoogle,
        updateUserProfile,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
