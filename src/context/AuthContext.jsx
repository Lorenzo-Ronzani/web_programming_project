import React, { createContext, useState, useContext, useEffect } from "react";
import usersData from "../data/users.json";

/*
  AuthContext
  ---------------------
  - Manages global authentication state (user info)
  - Provides login() and logout() methods
  - Persists user session in localStorage
  - Accessible from any component using useAuth()
*/

const AuthContext = createContext();

// Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Holds the currently logged-in user
  const [user, setUser] = useState(null);

  // Load user from localStorage (if already logged in)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle login
  const login = (username, password) => {
    // Find matching user from mock JSON data
    const foundUser = usersData.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser)); // ✅ Save session
      return true;
    }

    return false;
  };

  // Handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser"); // ✅ Clear session
  };

  // Provide user info and actions to all children components
  const value = {
    user,
    isAuthenticated: !!user, // Boolean shortcut
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
