import React, { useState } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import users from "../../data/users.json";
import courses from "../../data/courses.json";
import coursesUsers from "../../data/courses_users.json";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/*
  DashboardAdmin
  -------------------------
  - Displays admin overview with key statistics
  - Manages students, courses, and enrollments (mock JSON data)
  - Responsive layout; safe guards for undefined data
*/

const DashboardAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- Quick stats (safe checks with fallbacks)
  const totalStudents = users?.filter((u) => u.role === "student").length || 0;
  const totalCourses = courses?.length || 0;
  const totalEnrollments =
    coursesUsers?.reduce((acc, s) => acc + (s.courses?.length || 0), 0) || 0;

  // --- Average progress across all students (avoid division by zero)
  const avgProgress =
    coursesUsers?.length > 0
      ? Math.round(
          coursesUsers.reduce((acc, s) => {
            if (!s.courses || s.courses.length === 0) return acc;
            const total = s.courses.reduce(
              (sum, c) => sum + (c.progress || 0),
              0
            );
            return acc + total / s.courses.length;
          }, 0) / coursesUsers.length
        )
      : 0;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Welcome message */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome, {user?.firstName || "Admin"} {user?.lastName || ""}
          </h2>
          <p className="text-gray-500 mt-1">
            Manage students, courses, and enrollment data.
          </p>
        </div>

        {/* Overview cards */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card label="Total Students" value={totalStudents} sub="Active" />
          <Card label="Courses Offered" value={totalCourses} sub="This term" />
          <Card label="Enrollments" value={totalEnrollments} sub="Total records" />
          <Card
            label="Avg Progress"
            value={`${avgProgress}%`}
            sub="Across all students"
          />
        </div>

        {/* Data tables section */}
        <CoursesTable courses={courses} navigate={navigate} />
        <div className="mt-6">
          <StudentsTable students={users} coursesUsers={coursesUsers} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

/* 
  Card Component
  -----------------
  Displays a simple overview metric (e.g., total students)
*/
const Card = ({ label, value, sub }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xs text-gray-400 mt-1">{sub}</p>
  </div>
);

/*
  StudentsTable Component
  -------------------------
  Displays only users with the "student" role
*/
const StudentsTable = ({ students, coursesUsers }) => {
  const filteredStudents = (students || []).filter((s) => s.role === "student");

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Students Overview
      </h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-3 text-gray-600">Student ID</th>
            <th className="py-2 px-3 text-gray-600">Name</th>
            <th className="py-2 px-3 text-gray-600">Email</th>
            <th className="py-2 px-3 text-gray-600">Status</th>
            <th className="py-2 px-3 text-gray-600">Courses</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => {
            const enrollment = (coursesUsers || []).find(
              (s) => s.student_id === student.student_id
            );
            return (
              <tr
                key={student.student_id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-2 px-3 text-sm text-gray-700">
                  {student.student_id}
                </td>
                <td className="py-2 px-3 text-sm text-gray-700">
                  {student.firstName} {student.lastName}
                </td>
                <td className="py-2 px-3 text-sm text-gray-700">
                  {student.email}
                </td>
                <td className="py-2 px-3 text-sm text-gray-700">
                  {student.status}
                </td>
                <td className="py-2 px-3 text-sm text-gray-700">
                  {enrollment?.courses?.length || 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/*
  CoursesTable Component
  -------------------------
  Displays all available courses with:
  - Responsive header (title, search, and Add button)
  - Search by code or title
  - Edit button to navigate to /courseedit/:code
*/
const CoursesTable = ({ courses, navigate }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter courses by title or code (case-insensitive)
  const filteredCourses = (courses || []).filter((course) => {
    const q = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q)
    );
  });

  // Navigate to edit course page
  const handleEdit = (course) => {
    navigate(`/courseedit/${course.code}`);
  };

  // Navigate to add course page
  const handleAddCourse = () => {
    navigate("/courseadd");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header section: title + search + add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Courses List</h3>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search field */}
          <input
            type="text"
            placeholder="Search by code or title..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Add Course button */}
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
          >
            + Add Course
          </button>
        </div>
      </div>

      {/* Courses table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-3 text-gray-600">Code</th>
            <th className="py-2 px-3 text-gray-600">Title</th>
            <th className="py-2 px-3 text-gray-600">Instructor</th>
            <th className="py-2 px-3 text-gray-600">Credits</th>
            <th className="py-2 px-3 text-gray-600">Status</th>
            <th className="py-2 px-3 text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr
              key={course.code}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="py-2 px-3 text-sm text-gray-700">{course.code}</td>
              <td className="py-2 px-3 text-sm text-gray-700">{course.title}</td>
              <td className="py-2 px-3 text-sm text-gray-700">{course.instructor}</td>
              <td className="py-2 px-3 text-sm text-gray-700">{course.credits}</td>
              <td className="py-2 px-3 text-sm text-gray-700">{course.status}</td>
              <td className="py-2 px-3 text-sm text-right">
                <button
                  onClick={() => handleEdit(course)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {filteredCourses.length === 0 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          No courses found.
        </p>
      )}
    </div>
  );
};

export default DashboardAdmin;
