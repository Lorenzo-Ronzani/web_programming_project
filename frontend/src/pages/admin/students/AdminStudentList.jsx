import React, { useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "../../../api";
import { Link } from "react-router-dom";

const AdminStudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState("studentId");
  const [sortDirection, setSortDirection] = useState("asc");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ------------------------------------------------------------
  // Load students from backend (same structure used in DashboardAdmin)
  // ------------------------------------------------------------
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetch(buildApiUrl("getUsers"));
        const json = await res.json();

        const list = (json.items || json || []).filter(
          (u) => u.role === "student"
        );

        setStudents(list);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };

    loadStudents();
  }, []);

  // ------------------------------------------------------------
  // Sorting logic
  // ------------------------------------------------------------
  const sortedStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => {
      let v1 = String(a[sortField] || "").toLowerCase();
      let v2 = String(b[sortField] || "").toLowerCase();

      if (v1 < v2) return sortDirection === "asc" ? -1 : 1;
      if (v1 > v2) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [students, sortField, sortDirection]);

  // ------------------------------------------------------------
  // Filter logic
  // ------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();

    return sortedStudents.filter((s) => {
      const name = `${s.firstName} ${s.lastName}`.toLowerCase();

      return (
        name.includes(q) ||
        (s.student_id || "").toLowerCase().includes(q)
      );
    });
  }, [sortedStudents, search]);

  // ------------------------------------------------------------
  // Pagination
  // ------------------------------------------------------------
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginated = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------
  return (
    <div className="p-8">
      {/* Title & Search */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Students</h1>

        <input
          type="text"
          placeholder="Search students..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table Container */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th
                className="p-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("studentId")}
              >
                ID{" "}
                {sortField === "studentId" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>

              <th
                className="p-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("firstName")}
              >
                Name{" "}
                {sortField === "firstName" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>

              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.studentId}</td>
                <td className="p-3">
                  {s.firstName} {s.lastName}
                </td>

                <td className="p-3 text-blue-600 underline">
                  <Link to={`/dashboardadmin/students/${s.studentId}`}>
                    View Courses
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Showing {paginated.length} of {filteredStudents.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              className="px-3 py-1 border rounded"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentList;
