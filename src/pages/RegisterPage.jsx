import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar/TopBar";
import { buildApiUrl } from "../api";

/*
  RegisterPage
  ---------------------------------------------
  Handles creation of new user accounts.
  Sends data to backend Firebase Function
  responsible for user creation and validation.
*/

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form state fields
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // UI feedback messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle changes in input fields
  const handleChange = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*
    Validates fields and sends the registration request
    to the backend API (Firebase Function).
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation for empty fields
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.password ||
      !newUser.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    // Verify if password and confirmation match
    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const url = buildApiUrl("createUser");

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password
        })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error("Registration error:", err);
      setError("Cannot contact server. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />

      <div className="flex flex-1 items-center justify-center px-4 pt-24 pb-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create your account
          </h1>

          {/* Error and success feedback */}
          {error && <p className="text-center text-red-600 mb-4 text-sm">{error}</p>}
          {success && <p className="text-center text-green-600 mb-4 text-sm">{success}</p>}

          {/* Name fields in two columns */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={newUser.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>

          {/* Link to login page */}
          <p className="mt-4 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
