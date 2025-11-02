import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/topbar/TopBar";

/*
  LoginPage.jsx
  ---------------------
  - Authenticates user via AuthContext (with inactive check)
  - Displays clear success/error feedback
  - Modern, clean, responsive layout with Tailwind styling
*/

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle login with detailed validation and error feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(username, password);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // ✅ Redirect after successful login
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* ✅ Fixed TopBar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <TopBar />
      </div>

      {/* ==== Centered Login Form ==== */}
      <div className="flex flex-1 items-center justify-center px-4 pt-24 pb-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200"
        >
          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Sign in to your account
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-3 py-2 mb-4 text-center">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 rounded-lg text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Register link */}
          <p className="text-sm text-gray-500 text-center mt-4">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
