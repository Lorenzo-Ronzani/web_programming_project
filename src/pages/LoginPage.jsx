import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/topbar/TopBar";

/*
  LoginPage
  -------------------------------------------------------------
  Handles:
    - Email/Password login (Firebase)
    - Google login (Firebase)
    - Redirection based on user role and profile completeness
*/

const LoginPage = () => {
  const { loginWithEmailAndPassword, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
    Email/Password login handler
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginWithEmailAndPassword(email, password);

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Invalid credentials.");
      return;
    }

    if (result.requiresProfile) {
      navigate("/settings");
    } else {
      navigateBasedOnRole(result.user);
    }
  };

  /*
    Google login handler
  */
  const handleGoogleLogin = async () => {
    setError("");

    const result = await loginWithGoogle();

    if (!result.success) {
      setError(result.message || "Google authentication failed.");
      return;
    }

    if (result.requiresProfile) {
      navigate("/settings");
    } else {
      navigateBasedOnRole(result.user);
    }
  };

  /*
    Redirect user based on role
  */
  const navigateBasedOnRole = (user) => {
    const role = user?.role?.toLowerCase();

    if (role === "admin") {
      navigate("/dashboardadmin");
    } else {
      navigate("/dashboarduser");
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gray-50">
      {/* Top navigation bar */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <TopBar />
      </div>

      {/* Login form container */}
      <div className="flex flex-1 items-center justify-center px-4 pt-24 pb-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Sign in to your account
          </h1>

          {/* Display error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password field */}
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

          {/* Email login button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-3 w-full rounded-lg bg-red-500 py-2 font-semibold text-white transition hover:bg-red-600"
          >
            Continue with Google
          </button>

          {/* Registration link */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
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
