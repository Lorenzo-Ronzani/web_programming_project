import React, { useState } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import coursesData from "../../data/courses.json"; // Import courses from json data

/*
  CourseRegistration Page
  ----------------------------
  - Displays available courses for registration
  - Allows filtering and searching
  - Shows seat availability and action buttons
*/

const CourseRegistration = () => {
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("Spring 2025");

  // Use imported JSON 
  const courses = coursesData;

  // Filter by by title ou code
  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <TopBar />

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Course Registration
          </h2>
          <p className="text-gray-500 text-sm">
            Register for {term} courses (2–5 courses allowed)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-3">
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option>Fall 2024</option>
                <option>Spring 2025</option>
                <option>Summer 2025</option>
              </select>

              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                Filter Courses
              </button>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Instructor</th>
                <th className="px-6 py-3">Schedule</th>
                <th className="px-6 py-3">Credits</th>
                <th className="px-6 py-3">Availability</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  {/* Course Info */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <div>
                      <p className="font-semibold hover:text-blue-600 cursor-pointer">
                        {course.title}
                      </p>
                      <p className="text-xs text-gray-500">{course.code}</p>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.photo}
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{course.instructor}</span>
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-6 py-4 text-gray-600">{course.schedule}</td>

                  {/* Credits */}
                  <td className="px-6 py-4">{course.credits}</td>

                  {/* Availability */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`${
                          course.available === 0
                            ? "text-red-500"
                            : course.available < 10
                            ? "text-orange-500"
                            : "text-green-600"
                        } text-sm font-medium`}
                      >
                        {course.available}/{course.total} Available
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            course.available === 0
                              ? "bg-red-500"
                              : course.available < 10
                              ? "bg-orange-400"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(course.available / course.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    {course.available > 0 ? (
                      <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition">
                        Register
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-3 py-1.5 rounded-md text-sm cursor-not-allowed"
                      >
                        Full
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseRegistration;
