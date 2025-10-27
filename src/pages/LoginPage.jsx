import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  LoginPage:
  - Displays a standalone login form.
  - Uses AuthContext to validate credentials (from users.json).
  - Redirects to the home page ("/") after successful login.
*/
const LoginPage = () => {
  const { login } = useAuth(); // imported from context
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate("/"); // redirect to home after login
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 border border-gray-200"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500"
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
  );
};

export default LoginPage;
