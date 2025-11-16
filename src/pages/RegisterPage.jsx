import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar/TopBar";
import { buildApiUrl } from "../api";

/*
  RegisterPage (API Version)
  ---------------------------------------------
  - Fetches existing users from backend API
  - Validates uniqueness of username
  - Prepares POST request to create a new user
  - Removes localStorage and JSON dependencies
*/

const RegisterPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student",
    status: "active",
    photo: "/images/default-avatar.png",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔥 Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(buildApiUrl("getUsers"));
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // 🔥 Submit new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!newUser.username || !newUser.password || !newUser.firstName || !newUser.lastName) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    // Check for duplicate username
    const existingUser = users.find((u) => u.username === newUser.username);
    if (existingUser) {
      setError("This username already exists. Please choose another one.");
      setSuccess("");
      return;
    }

    try {
      // 🔥 Here we prepare the POST request for your backend
      const res = await fetch(buildApiUrl("createUser"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error("Failed to register user.");
      }

      setError("");
      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error("Register error:", err);
      setError("Error registering user. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading registration form...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />

      <div className="flex flex-1 items-center justify-center px-4 pt-24">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create your account
          </h1>

          {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-4 text-center">{success}</div>}

          {/* FIRST NAME */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={newUser.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* LAST NAME */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={newUser.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* USERNAME */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
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
