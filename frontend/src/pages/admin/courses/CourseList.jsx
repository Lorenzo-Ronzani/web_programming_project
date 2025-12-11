import React, { useEffect, useState, useMemo } from "react";
import { getCourses, deleteCourse } from "../../../api/courses";
import { Link } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [sortConfig, setSortConfig] = useState({
    field: "title",
    direction: "asc",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);

    const result = await getCourses();

    if (result.success) {
      setCourses(result.items);
    } else {
      alert("Error loading courses.");
    }

    setLoading(false);
  }

  const handleSort = (field) => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" }
    );
  };

  const sortIcon = (field) => {
    if (sortConfig.field !== field) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();

    const filteredItems = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.code.toLowerCase().includes(searchLower) ||
        c.instructor.toLowerCase().includes(searchLower)
    );

    const sorted = [...filteredItems].sort((a, b) => {
      let aValue = a[sortConfig.field] ?? "";
      let bValue = b[sortConfig.field] ?? "";

      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return sorted;
  }, [courses, search, sortConfig]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    const result = await deleteCourse(id);

    if (result.success) {
      loadCourses();
    } else {
      alert(result.message || "Error deleting course.");
    }
  };

  if (loading) return <p className="p-6">Loading courses...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">

      {/* ===================== HEADER ===================== */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Courses</h1>

        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            placeholder="Search by code, title, or instructor..."
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />

          <Link
            to="/dashboardadmin/courses/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Course
          </Link>
        </div>
      </div>

      {/* ===================== TABLE ===================== */}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b text-gray-600 select-none">

            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => handleSort("code")}
            >
              Code {sortIcon("code")}
            </th>

            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title {sortIcon("title")}
            </th>

            <th className="py-3 px-2">Instructor</th>
            <th className="py-3 px-2">Credits</th>

            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => handleSort("show_on_homepage")}
            >
              Homepage {sortIcon("show_on_homepage")}
            </th>

            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="text-center text-gray-500 py-8"
              >
                No courses found.
              </td>
            </tr>
          ) : (
            filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b hover:bg-gray-50"
              >
                {/* CODE */}
                <td className="py-3 px-2 font-medium">{c.code}</td>

                {/* TITLE + ICON */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {c.icon && (
                      <span
                        className={`material-symbols-outlined text-${c.color}-600`}
                      >
                        {c.icon}
                      </span>
                    )}
                    {c.title}
                  </div>
                </td>

                {/* INSTRUCTOR + PHOTO */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {c.photo && (
                      <img
                        src={c.photo}
                        alt="photo"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    {c.instructor || "-"}
                  </div>
                </td>

                {/* CREDITS */}
                <td className="py-3 px-2">{c.credits || 0}</td>

                {/* HOMEPAGE */}
                <td className="py-3 px-2">
                  {c.show_on_homepage ? "Yes" : "No"}
                </td>

                {/* STATUS */}
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 text-white rounded ${
                      c.is_active ? "bg-green-600" : "bg-gray-500"
                    }`}
                  >
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="py-3 px-2 text-center">
                  <div className="flex justify-center gap-4">

                    <Link
                      to={`/dashboardadmin/courses/edit/${c.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}
