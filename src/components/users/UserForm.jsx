import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import usersData from "../../data/users.json";
import coursesData from "../../data/courses.json";

/*
  UserForm.jsx
  ----------------------------------
  - Reusable form for adding or editing users
  - Displays Program as read-only for students
  - Admins can select a program from a dropdown
  - Includes Enrollment Date field
*/

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    student_id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    photo: "",
    role: "student",
    status: "active",
    program: "",
    program_id: "",
    programTitle: "",
    enrollmentDate: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Load user data if editing
  useEffect(() => {
    if (id) {
      const existingUser = usersData.find(
        (u) => u.student_id === id || String(u.id) === id
      );
      if (existingUser) {
        setUser(existingUser);
        setIsEditMode(true);
      }
    }
  }, [id]);

  // Handle general input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle program selection and update program fields
  const handleProgramChange = (e) => {
    const selectedCourseId = Number(e.target.value);
    const selectedCourse = coursesData.find((c) => c.id === selectedCourseId);

    if (selectedCourse) {
      setUser((prev) => ({
        ...prev,
        program: `${selectedCourse.title} ${selectedCourse.programTitle}`,
        program_id: selectedCourse.program_id,
        programTitle: selectedCourse.programTitle,
      }));
    }
  };

  // Handle active/inactive checkbox
  const handleStatusChange = (e) => {
    setUser((prev) => ({
      ...prev,
      status: e.target.checked ? "active" : "inactive",
    }));
  };

  // Simulate save (no backend yet)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      alert(`User "${user.firstName} ${user.lastName}" updated successfully!`);
    } else {
      alert(`User "${user.firstName} ${user.lastName}" added successfully!`);
    }

    navigate("/manageusers");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {isEditMode ? `Edit User: ${user.firstName}` : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Status + Username */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={user.status === "active"}
                  onChange={handleStatusChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="status" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Password (Add mode only) */}
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            {/* Academic Information */}
            <div className="grid grid-cols-2 gap-4">
              {/* Program */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Program
                </label>
                {user.role === "admin" || !isEditMode ? (
                  <select
                    name="program"
                    value={user.program || ""}
                    onChange={handleProgramChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Program...</option>
                    {coursesData.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} – {course.title} ({course.programTitle})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="program"
                    value={user.program || ""}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none"
                  />
                )}
              </div>

              {/* Enrollment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={user.enrollmentDate || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo URL
              </label>
              <input
                type="url"
                name="photo"
                value={user.photo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://i.pravatar.cc/100?img=1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate("/manageusers")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isEditMode ? "Save Changes" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserForm;
