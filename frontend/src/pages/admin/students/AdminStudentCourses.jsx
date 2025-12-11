import React, { useEffect, useState } from "react";
import { buildApiUrl } from "../../../api";
import { apiUpdateStudentCourseGrade } from "../../../api/adminStudentCourses";

// Admin panel for managing student course grades
// Loads students, loads studentCourses, and allows updating grades

const AdminStudentCourses = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");

  const [studentCourses, setStudentCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetch(buildApiUrl("getUsers"));
        const json = await res.json();

        // Normalize backend response structure (same as DashboardAdmin.jsx)
        const rawList = json.items || json || [];

        // Filter only users with student role
        const list = rawList.filter((u) => u.role === "student");

        setStudents(list);
        setFilteredStudents(list);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };

    loadStudents();
  }, []);

  // ------------------------------------------------------------
  // Load all available courses (course catalog)
  // ------------------------------------------------------------
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch(buildApiUrl("getCourses"));
        const json = await res.json();

        const list = json.items || json || [];
        setAllCourses(list);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };

    loadCourses();
  }, []);

  // ------------------------------------------------------------
  // Load studentCourses for selected student
  // ------------------------------------------------------------
  const loadStudentCourses = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        buildApiUrl("getStudentCourses") + `?student_id=${selectedStudent}`
      );

      const json = await res.json();
      const list = json.items || json || [];

      setStudentCourses(list);
    } catch (err) {
      console.error("Error loading studentCourses:", err);
      setError("Failed to load student course records.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Save grade for a specific student course record
  // ------------------------------------------------------------
  const handleSaveGrade = async (record) => {
    setMessage("");
    setError("");

    try {
      const data = {
        grade: Number(record.grade),
        grade_letter: record.grade_letter,
        grade_points: Number(record.grade_points),
        completed: record.completed,
      };

      await apiUpdateStudentCourseGrade(record.id, data, buildApiUrl);

      setMessage("Grade updated successfully.");
      await loadStudentCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to update grade.");
    }
  };

  // ------------------------------------------------------------
  // Find full course information by ID
  // ------------------------------------------------------------
  const resolveCourse = (id) => {
    return allCourses.find((c) => c.id === id) || {};
  };

  // ------------------------------------------------------------
  // Filter students by search term
  // ------------------------------------------------------------
  const handleSearch = (value) => {
    setSearch(value);

    const q = value.toLowerCase();

    const filtered = students.filter((s) => {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      const id = (s.student_id || "").toLowerCase();

      return fullName.includes(q) || id.includes(q);
    });

    setFilteredStudents(filtered);
  };

  // ------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-6">
        Admin: Manage Student Course Grades
      </h1>

      {/* Success message */}
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search student by name or ID..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Student Selector */}
      <div className="mb-6">
        <label className="block text-sm mb-2 font-medium">Select Student</label>

        <select
          className="border rounded p-2 w-full"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Choose...</option>

          {filteredStudents.map((s) => (
            <option key={s.id} value={s.student_id}>
              {s.firstName} {s.lastName} ({s.student_id})
            </option>
          ))}
        </select>

        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={loadStudentCourses}
          disabled={!selectedStudent}
        >
          Load Courses
        </button>
      </div>

      {/* TABLE OF STUDENT COURSES */}
      {loading ? (
        <p>Loading data...</p>
      ) : studentCourses.length === 0 ? (
        <p>No registered courses for this student.</p>
      ) : (
        <table className="w-full border-collapse mt-6">
          <thead>
            <tr className="bg-gray-100 border">
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Term</th>
              <th className="p-2 border">Grade</th>
              <th className="p-2 border">Letter</th>
              <th className="p-2 border">Points</th>
              <th className="p-2 border">Completed</th>
              <th className="p-2 border">Save</th>
            </tr>
          </thead>

          <tbody>
            {studentCourses.map((sc) => {
              const course = resolveCourse(sc.course_id);

              return (
                <tr key={sc.id} className="border">
                  <td className="p-2 border">{course.title}</td>
                  <td className="p-2 border">{sc.term}</td>

                  {/* Editable fields */}
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={sc.grade || ""}
                      onChange={(e) => (sc.grade = e.target.value)}
                      className="border p-1 w-20"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="text"
                      value={sc.grade_letter || ""}
                      onChange={(e) => (sc.grade_letter = e.target.value)}
                      className="border p-1 w-20"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="number"
                      step="0.1"
                      value={sc.grade_points || ""}
                      onChange={(e) => (sc.grade_points = e.target.value)}
                      className="border p-1 w-20"
                    />
                  </td>

                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      checked={sc.completed || false}
                      onChange={(e) => (sc.completed = e.target.checked)}
                    />
                  </td>

                  <td className="p-2 border text-center">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleSaveGrade(sc)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminStudentCourses;
