import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import coursesData from "../../data/courses.json";

/*
  CourseEdit.jsx
  -------------------------
  - Displays a form for editing a specific course
  - Loads course data using the code parameter from URL
  - Allows admin to edit course info and save changes
  - Includes checkbox for course status (active/inactive)
*/

const CourseEdit = () => {
  const { code } = useParams(); // Course code from URL
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  // ✅ Load the selected course based on the URL parameter
  useEffect(() => {
    const foundCourse = coursesData.find((c) => c.code === code);
    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [code]);

  // ✅ Handle input changes for text/number/textarea fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle checkbox change (status field)
  const handleStatusChange = (e) => {
    const isChecked = e.target.checked;
    setCourse((prev) => ({
      ...prev,
      status: isChecked ? "active" : "inactive",
    }));
  };

  // ✅ Simulate a save operation (could be replaced with API call)
  const handleSave = (e) => {
    e.preventDefault();
    alert(
      `✅ Course "${course.title}" has been updated successfully!\nStatus: ${course.status}`
    );
    navigate("/dashboardadmin");
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="bg-white shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Edit Course: {course.code}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Title + Status (checkbox side by side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Title field */}
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

              {/* Status checkbox */}
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

            {/* Code field (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={course.code}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* Instructor field */}
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

            {/* Credits and Available fields */}
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

            {/* Description field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={course.description}
                onChange={handleChange}
                rows="4"
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
                Save Changes
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
