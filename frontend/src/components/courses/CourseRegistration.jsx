import React, { useState, useEffect } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../api";

const CourseRegistration = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("All");
  const [programFilter, setProgramFilter] = useState("All");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Busca cursos do backend (Firebase Functions via API)
  useEffect(() => {
    const url = buildApiUrl("getCourses"); // mesmo padrão do componente Courses

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched courses (registration):", data);
        setCourses(data);
      })
      .catch((err) => {
        console.error("Error fetching courses for registration:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🧠 Filtro de cursos (com filtro por program_id)
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());

    const matchesTerm = term === "All" || c.term === term;

    // 🎯 Filtro por Program ID (1,2,3 vindo do backend)
    const matchesProgram =
      programFilter === "All" ||
      (programFilter === "Diploma" && c.program_id === 1) ||
      (programFilter === "Post-Diploma" && c.program_id === 2) ||
      (programFilter === "Certificate" && c.program_id === 3);

    return matchesSearch && matchesTerm && matchesProgram;
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Course Registration
          </h2>
          <p className="text-gray-500 text-sm">
            Showing all available courses in the system.
          </p>
        </div>

        {/* Se ainda estiver carregando */}
        {loading ? (
          <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-600">
            Loading courses...
          </div>
        ) : (
          <>
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
                  {/* Program Filter */}
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="All">All Programs</option>
                    <option value="Diploma">Diploma Programs</option>
                    <option value="Post-Diploma">
                      Post-Diploma Certificates
                    </option>
                    <option value="Certificate">Certificate Programs</option>
                  </select>

                  {/* Term Filter */}
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="All">All Terms</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Winter 2026">Winter 2026</option>
                    <option value="Spring 2026">Spring 2026</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Course</th>
                    <th className="px-6 py-3">Program</th>
                    <th className="px-6 py-3">Instructor</th>
                    <th className="px-6 py-3">Schedule</th>
                    <th className="px-6 py-3">Credits</th>
                    <th className="px-6 py-3">Availability</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr
                        key={course.id}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        {/* Course Info */}
                        <td className="px-6 py-4 font-medium text-gray-800">
                          <div>
                            <p className="font-semibold hover:text-blue-600 cursor-pointer">
                              {course.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course.code}
                            </p>
                            <p className="text-xs text-gray-400 italic mt-1">
                              {course.description}
                            </p>
                          </div>
                        </td>

                        {/* Program */}
                        <td className="px-6 py-4 text-gray-700">
                          {course.programTitle}
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
                        <td className="px-6 py-4 text-gray-600">
                          {course.schedule}
                        </td>

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
                                  width: `${
                                    (course.available / course.total) * 100
                                  }%`,
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
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-gray-500 italic"
                      >
                        No courses found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CourseRegistration;
