import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/topbar/TopBar";

/*
  LoginPage
  ---------------------
  - Displays a standalone login form below the TopBar.
  - Uses AuthContext to validate credentials from users.json.
  - Redirects to the home page ("/") after successful login.
  - Fixed layout spacing: no margin above the TopBar.
*/

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate("/"); // ✅ Redirect to home page
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* ✅ Fixed TopBar at top (no space above) */}
      <div className="fixed top-0 left-0 w-full z-50">
        <TopBar />
      </div>

      {/* ==== Centered Login Form ==== */}
      <div className="flex flex-1 items-center justify-center px-4 pt-24"> 
        {/* 👆 added pt-24 (padding-top) to prevent overlap with TopBar */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Sign in to your account
          </h1>

          {error && (
            <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Don’t have an account?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
