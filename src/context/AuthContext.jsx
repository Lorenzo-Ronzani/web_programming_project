import React, { createContext, useState, useContext, useEffect } from "react";
import usersData from "../data/users.json";

/*
  AuthContext
  ------------------------
  - Manages user login/logout globally
  - Loads user from localStorage if session exists
  - Exposes login(), logout(), and user info
*/

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Start with undefined to detect loading state
  const [user, setUser] = useState(undefined);

  // Load user session from localStorage (once)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  // Login function
  const login = (username, password) => {
    const foundUser = usersData.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
