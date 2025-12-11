import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { buildApiUrl } from "../../../api";

const AdminStudentCoursesList = () => {
  const { id } = useParams(); // This is studentId (ST000001)

  const [courses, setCourses] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Load student courses
        const res = await fetch(
          buildApiUrl("getStudentCourses") + `?studentId=${id}`
        );
        const json = await res.json();
        setCourses(json.items || []);

        // Load catalog
        const resCatalog = await fetch(buildApiUrl("getCourses"));
        const jsonCatalog = await resCatalog.json();
        setCatalog(jsonCatalog.items || []);

        // Load student info (PHOTO + NAME)
        const resStudent = await fetch(
          buildApiUrl("getUserByStudentId") + `?studentId=${id}`
        );
        const jsonStudent = await resStudent.json();

        if (jsonStudent?.success) {
          setStudent(jsonStudent.item);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  const resolveCourse = (cid) =>
    catalog.find((c) => c.id === cid) || {};

  return (
    <div className="p-8">
      {/* TOP HEADER */}
      <div className="flex items-center gap-4 mb-8">
        {student?.photo ? (
          <img
            src={student.photo}
            alt="Student"
            className="w-16 h-16 rounded-full object-cover border shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 border shadow-md" />
        )}

        <div>
          <h1 className="text-2xl font-semibold">
            {student ? `${student.firstName} ${student.lastName}` : "Loading..."}
          </h1>

          <p className="text-gray-600 text-sm">Student ID: {id}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {courses.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No courses registered for this student.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b">
                <th className="p-3 text-left font-medium">Course</th>
                <th className="p-3 text-left font-medium">Term</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c) => {
                const full = resolveCourse(c.course_id);

                return (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <span className="font-medium text-gray-900">
                        {full.title || "Unknown course"}
                      </span>
                      <div className="text-xs text-gray-500">{full.code}</div>
                    </td>

                    <td className="p-3">{c.term}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          c.status === "registered"
                            ? "bg-blue-100 text-blue-700"
                            : c.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <Link
                        to={`/dashboardadmin/students/${id}/${c.id}`}
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                      >
                        Edit Grade
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStudentCoursesList;
