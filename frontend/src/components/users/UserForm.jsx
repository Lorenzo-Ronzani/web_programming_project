import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { buildApiUrl } from "../../api";

/*
  UserForm.jsx (API Version)
  ----------------------------------
  - Loads users and courses from backend API
  - Supports edit mode by loading user via student_id or id
  - Allows admin to assign a program
*/

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Load courses and user (if editing)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load courses
        const coursesRes = await fetch(buildApiUrl("getCourses"));
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

        // If editing → load user
        if (id) {
          const usersRes = await fetch(buildApiUrl("getUsers"));
          const usersData = await usersRes.json();

          const foundUser = usersData.find(
            (u) => u.student_id === id || String(u.id) === id
          );

          if (foundUser) {
            setUser(foundUser);
            setIsEditMode(true);
          }
        }
      } catch (err) {
        console.error("Error loading UserForm data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Program change using API course list
  const handleProgramChange = (e) => {
    const selectedId = Number(e.target.value);
    const selectedCourse = courses.find((c) => c.id === selectedId);

    if (selectedCourse) {
      setUser((prev) => ({
        ...prev,
        program: `${selectedCourse.title} ${selectedCourse.programTitle}`,
        program_id: selectedCourse.program_id,
        programTitle: selectedCourse.programTitle,
      }));
    }
  };

  const handleStatusChange = (e) => {
    setUser((prev) => ({
      ...prev,
      status: e.target.checked ? "active" : "inactive",
    }));
  };

  // (Future: send to backend — for now only navigate + alert)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      alert(`User "${user.firstName} ${user.lastName}" updated successfully!`);
    } else {
      alert(`User "${user.firstName} ${user.lastName}" added successfully!`);
    }

    navigate("/manageusers");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Loading user form...
      </div>
    );
  }

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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                required
              />
            </div>

            {/* Password (Add only) */}
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            {/* Program + Enrollment Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Program
                </label>

                {user.role === "admin" || !isEditMode ? (
                  <select
                    name="program"
                    value={user.program || ""}
                    onChange={handleProgramChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Select Program...</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} – {course.title} ({course.programTitle})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={user.program || ""}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-50"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={user.enrollmentDate || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
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
                placeholder="https://i.pravatar.cc/100?img=1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate("/manageusers")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
