import React, { useEffect, useState } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../api";

/*
  DashboardUser (API Version)
  -----------------------------------------
  - Loads real data from API (Firebase Functions)
  - Removes JSON dependency
  - Fetches courses + student enrollments
*/

const DashboardUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [coursesUsers, setCoursesUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Overview mock (por enquanto)
  const overviewData = [
    { label: "Total Credits", value: 15, sub: "Full load this term" },
    { label: "GPA", value: 3.7, sub: "+0.2 from last term" },
    { label: "Completed Courses", value: 24, sub: "72 credits earned" },
    { label: "Remaining Credits", value: 48, sub: "To graduation" },
  ];

  const studentId = user?.student_id;

  // 🔥 Load all API data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cuRes, coursesRes] = await Promise.all([
          fetch(buildApiUrl("getCoursesUsers")),
          fetch(buildApiUrl("getCourses")),
        ]);

        const cuData = await cuRes.json();
        const coursesData = await coursesRes.json();

        setCoursesUsers(cuData);
        setCourses(coursesData);
      } catch (err) {
        console.error("Error loading user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔎 Buscando apenas as matrículas do aluno logado
  const enrollment = coursesUsers.find((s) => s.student_id === studentId);

  // Lista de cursos do aluno (somente IDs)
  const studentCourses = enrollment?.courses || [];

  // 🔗 Juntar dados: matrícula + dados completos do curso
  const currentCourses = studentCourses
    .map((enrolledCourse) => {
      const fullCourse = courses.find((c) => c.code === enrolledCourse.code);
      return {
        ...enrolledCourse, // progress, room, etc
        ...fullCourse, // title, instructor, schedule, credits
      };
    })
    .filter((c) => c.code); // evitar undefined

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopBar />

      <main className="container mx-auto flex-1 px-6 py-8">
        {/* Welcome section */}
        <div className="mb-8 flex flex-col rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.firstName || "Student"}!
            </h2>
            <p className="mt-1 text-gray-500">
              Ready to continue your learning journey?
            </p>
          </div>

          <div className="mt-4 text-right md:mt-0">
            <p className="text-gray-600">
              <span className="font-semibold">{user?.role}</span> Dashboard
            </p>
            <p className="text-sm text-gray-400">
              Logged in as {user?.firstName} {user?.lastName} (ID:{" "}
              {user?.student_id})
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-gray-600 text-lg">Loading your courses...</p>
        ) : (
          <>
            {/* Academic Overview */}
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Academic Overview
            </h3>

            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-4">
              {overviewData.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <h4 className="text-2xl font-bold text-gray-800">
                    {item.value}
                  </h4>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-1 text-xs text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Current Courses */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Current Courses – Fall 2024
              </h3>

              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                onClick={() => navigate("/coursesregistration")}
              >
                + Add Course
              </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {currentCourses.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  You are not enrolled in any courses this term.
                </p>
              ) : (
                currentCourses.map((course, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-md font-semibold text-gray-900">
                        {course.title}
                      </h4>
                      <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                        Enrolled
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {course.code} • {course.credits} Credits
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Instructor: {course.instructor}
                    </p>
                    <p className="text-sm text-gray-600">
                      Schedule: {course.schedule}
                    </p>
                    <p className="text-sm text-gray-600">Room: {course.room}</p>

                    <div className="mt-3">
                      <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2.5 rounded-full bg-blue-600"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Progress: {course.progress}%
                      </p>
                    </div>

                    <button
                      className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                      onClick={() => navigate(`/course/${course.code}`)}
                    >
                      View Course Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardUser;
