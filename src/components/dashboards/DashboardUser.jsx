import React from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import coursesUsers from "../../data/courses_users.json";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // navigation hook import

/*
  DashboardUser
  -------------------------
  - Displays student info and academic overview
  - Uses mock course data
  - Fetches current user info from AuthContext
*/

const DashboardUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // hook to handle navigation between pages

  // Mock data (you can fetch from DB later)
  const overviewData = [
    { label: "Total Credits", value: 15, sub: "Full load this term" },
    { label: "GPA", value: 3.7, sub: "+0.2 from last term" },
    { label: "Completed Courses", value: 24, sub: "72 credits earned" },
    { label: "Remaining Credits", value: 48, sub: "To graduation" },
  ];

  // Retrieve the logged-in user's student_id from the AuthContext
  const studentId = user?.student_id;

  // Find the courses that belong to the logged-in student
  const currentCourses =
    coursesUsers.find((student) => student.student_id === studentId)?.courses ||
    [];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <TopBar />

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Welcome section */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.firstName || "Student"}!
            </h2>
            <p className="text-gray-500 mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-gray-600">
              <span className="font-semibold">{user?.role}</span> Dashboard
            </p>
            <p className="text-sm text-gray-400">
              Logged in as {user?.firstName} {user?.lastName} {` ID: (${user?.student_id})`}
            </p>
          </div>
        </div>

        {/* Academic Overview */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Academic Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {overviewData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <h4 className="text-2xl font-bold text-gray-800">{item.value}</h4>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Current Courses */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Current Courses – Fall 2024
          </h3>

          {/* Button navigates to the Course Registration page */}
          <div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate("/coursesregistration")}
            >
              + Add Course
            </button>
          </div>
        </div>

        {/* List of Courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentCourses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-gray-900">
                  {course.title}
                </h4>
                <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-lg">
                  Enrolled
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {course.code} • {course.credits} Credits
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Instructor: {course.instructor}
              </p>
              <p className="text-sm text-gray-600">Schedule: {course.schedule}</p>
              <p className="text-sm text-gray-600">Room: {course.room}</p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Progress: {course.progress}%
                </p>
              </div>
              <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 py-2 rounded-lg transition">
                View Course Details
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardUser;
