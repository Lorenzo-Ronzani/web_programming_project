import React, { createContext, useState, useContext, useEffect } from 'react';
import usersData from '../data/users.json';

/*
  AuthContext
  ------------------------
  - Manages user login/logout globally
  - Loads user from localStorage if session exists
  - Exposes login(), logout(), and user info
  - Blocks login for inactive users
*/

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Start with undefined to detect loading state
  const [user, setUser] = useState(undefined);

  // Load user session from localStorage (once)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  //  Enhanced login function — now checks status
  const login = (username, password) => {
    const foundUser = usersData.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (!foundUser) {
      // Invalid credentials
      return { success: false, message: 'Invalid username or password.' };
    }

    if (foundUser.status !== 'active') {
      // Prevent login if user is inactive
      return { success: false, message: 'Your account is inactive. Please contact the administrator.' };
    }

    // Login success
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    return { success: true, user: foundUser };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
