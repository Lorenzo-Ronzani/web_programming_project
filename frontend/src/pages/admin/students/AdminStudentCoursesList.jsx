import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { buildApiUrl } from "../../../api";

const AdminStudentCoursesList = () => {
  const { id } = useParams(); // studentId
  const [courses, setCourses] = useState([]);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Student courses
        const res = await fetch(
          buildApiUrl("getStudentCourses") + `?studentId=${id}`
        );
        const json = await res.json();
        setCourses(json.items || json || []);

        // Course catalog (titles, etc.)
        const resCatalog = await fetch(buildApiUrl("getCourses"));
        const jsonCatalog = await resCatalog.json();
        setCatalog(jsonCatalog.items || jsonCatalog || []);
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
      {/* TITLE */}
      <h1 className="text-xl font-semibold mb-6">
        Courses for {id}
      </h1>

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
                      <div className="text-xs text-gray-500">
                        {full.code}
                      </div>
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
