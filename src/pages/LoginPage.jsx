import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/topbar/TopBar";

/*
  LoginPage
  -------------------------------------------------------------
  Displays the login form and uses AuthContext to authenticate
  the user via the backend login API.
*/

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Submit login credentials to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Navigate based on user role
    const role = result.user.role?.toLowerCase();
    if (role === "admin") {
      navigate("/dashboardadmin");
    } else {
      navigate("/dashboarduser");
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gray-50">
      <div className="fixed top-0 left-0 z-50 w-full">
        <TopBar />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pt-24 pb-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Sign in to your account
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-semibold text-white transition ${
              loading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span
              className="cursor-pointer text-blue-600 hover:underline"
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
