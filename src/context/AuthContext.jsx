import React, { createContext, useState, useContext, useEffect } from "react";
import { buildApiUrl } from "../api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/*
  AuthContext
  ---------------------------------------------------------
  Handles all authentication logic using the backend API.

  - Calls loginUser (Firebase Function)
  - Stores the session in localStorage
  - Keeps user state persistent across refreshes
  - Provides login() and logout() to the application
*/

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); 
  const [loading, setLoading] = useState(true);

  // Load local session when the app starts
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  /*
    login
    -------------------------------------------------------
    Calls the backend login API and authenticates the user.
    On success:
      - user data is stored in state
      - user data is saved to localStorage
  */
  const login = async (username, password) => {
    try {
      const url = buildApiUrl("loginUser");

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, message: result.message };
      }

      const loggedUser = result.user;
      setUser(loggedUser);
      localStorage.setItem("currentUser", JSON.stringify(loggedUser));

      return { success: true, user: loggedUser };
    } catch (error) {
      console.error("Login API error:", error);
      return { success: false, message: "Unable to connect to the server." };
    }
  };

  /*
    logout
    -------------------------------------------------------
    Clears session data from state and localStorage.
  */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
