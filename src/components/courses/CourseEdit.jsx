import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import coursesData from "../../data/courses.json";

/*
  CourseEdit.jsx
  -------------------------
  - Reused for both editing and adding a course
  - If "code" param exists → Edit mode
  - If no "code" → Add mode
*/

const CourseEdit = () => {
  const { code } = useParams(); // Course code from URL (optional)
  const navigate = useNavigate();

  const isEditMode = Boolean(code); // true if editing
  const [course, setCourse] = useState({
    code: "",
    title: "",
    instructor: "",
    credits: "",
    available: "",
    description: "",
    status: "inactive",
  });

  // ✅ Load existing course if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const foundCourse = coursesData.find((c) => c.code === code);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [code, isEditMode]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle checkbox change
  const handleStatusChange = (e) => {
    setCourse((prev) => ({
      ...prev,
      status: e.target.checked ? "active" : "inactive",
    }));
  };

  // ✅ Save or add new course
  const handleSave = (e) => {
    e.preventDefault();

    if (isEditMode) {
      alert(`✅ Course "${course.title}" has been updated successfully!`);
    } else {
      alert(`✅ New course "${course.title}" has been added successfully!`);
    }

    navigate("/dashboardadmin");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {isEditMode ? `Edit Course: ${course.code}` : "Add New Course"}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Title + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center mt-6 sm:mt-8">
                <input
                  type="checkbox"
                  id="status"
                  checked={course.status === "active"}
                  onChange={handleStatusChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="status"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>

            {/* Code field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={course.code}
                onChange={handleChange}
                disabled={isEditMode} // only editable in Add mode
                placeholder="Enter course code"
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                  isEditMode ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instructor
              </label>
              <input
                type="text"
                name="instructor"
                value={course.instructor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Credits & Available */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  value={course.credits}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available
                </label>
                <input
                  type="number"
                  name="available"
                  value={course.available}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={course.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter course description"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboardadmin")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isEditMode ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseEdit;
