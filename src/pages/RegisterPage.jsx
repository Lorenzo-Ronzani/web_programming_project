import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usersData from "../data/users.json";
import TopBar from "../components/topbar/TopBar";

/*
  RegisterPage
  ----------------------------
  - Allows new user registration.
  - Updates localStorage (simulating write to users.json).
  - Prevents duplicate usernames.
  - Redirects to login after successful registration.
*/

const RegisterPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    photo: "/images/default-avatar.png", // default image
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load initial users (from JSON or localStorage)
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (storedUsers) {
      setUsers(storedUsers);
    } else {
      setUsers(usersData);
    }
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields
    if (!newUser.username || !newUser.password || !newUser.firstName || !newUser.lastName) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    // Check for existing username
    const existingUser = users.find((u) => u.username === newUser.username);
    if (existingUser) {
      setError("This username already exists. Please choose another one.");
      setSuccess("");
      return;
    }

    // Add new user
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    setError("");
    setSuccess("Registration successful! Redirecting to login...");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ TopBar at top */}
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

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={newUser.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={newUser.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
          />

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
