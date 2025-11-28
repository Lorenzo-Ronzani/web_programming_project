// ---------------------------------------------------------------------------
// DashboardAdmin.jsx
// ---------------------------------------------------------------------------
// This file renders the administrator dashboard, including:
// - Overview metrics (students, programs, courses, enrollments, avg progress)
// - Programs table (search, sorting, pagination)
// - Courses table (search, sorting, pagination)
// - Students table (search, sorting, pagination)
// The dashboard uses data from backend API endpoints (getUsers, getCourses,
// getCoursesUsers, getPrograms).
// The layout is built with reusable components and utility helpers.
// All tables use the same sorting and pagination logic.
// ---------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Correct imports
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../api";

// ---------------------------------------------------------------------------
// Small statistic card component used in the overview section
// ---------------------------------------------------------------------------
const StatCard = ({ label, value, helper }) => (
  <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
    {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
  </div>
);

// ---------------------------------------------------------------------------
// Pagination component used across all table components
// ---------------------------------------------------------------------------
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goTo = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
      <div>
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border text-sm ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border text-sm ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Displays sort arrow in table headers
const SortArrow = ({ active, direction }) => {
  if (!active) return <span className="ml-1 text-gray-300">↕</span>;
  return (
    <span className="ml-1 text-gray-500">
      {direction === "asc" ? "↑" : "↓"}
    </span>
  );
};

// ---------------------------------------------------------------------------
// PROGRAMS TABLE
// ---------------------------------------------------------------------------
const ProgramsTable = ({ programs, navigate }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  // Handles sorting when clicking table headers
  const handleSort = (field) => {
    setPage(1);
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDirection("asc");
      return field;
    });
  };

  // Filtering by search text
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return programs.filter((p) => {
      const combined = `${p.title} ${p.credential}`.toLowerCase();
      return combined.includes(q);
    });
  }, [programs, search]);

  // Sorting
  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      const valA = (sortField === "credential"
        ? a.credential
        : a.title || ""
      )
        .toString()
        .toLowerCase();

      const valB = (sortField === "credential"
        ? b.credential
        : b.title || ""
      )
        .toString()
        .toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filtered, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Programs List</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            type="button"
            onClick={() => navigate("/dashboardadmin/programs/add")}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Program
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">No programs found.</p>
      ) : (
        <>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th
                  className="py-3 px-2 cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <span className="inline-flex items-center">
                    Title
                    <SortArrow
                      active={sortField === "title"}
                      direction={sortDirection}
                    />
                  </span>
                </th>
                <th
                  className="py-3 px-2 cursor-pointer"
                  onClick={() => handleSort("credential")}
                >
                  <span className="inline-flex items-center">
                    Credential
                    <SortArrow
                      active={sortField === "credential"}
                      direction={sortDirection}
                    />
                  </span>
                </th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{p.title}</td>
                  <td className="py-2 px-2">{p.credential}</td>
                  <td className="py-2 px-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
                      onClick={() =>
                        navigate(`/dashboardadmin/programs/edit/${p.id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// COURSES TABLE
// ---------------------------------------------------------------------------
const CoursesTable = ({ courses, navigate }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  // Sorting handler
  const handleSort = (field) => {
    setPage(1);
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDirection("asc");
      return field;
    });
  };

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter((c) => {
      const combined = `${c.code} ${c.title}`.toLowerCase();
      return combined.includes(q);
    });
  }, [courses, search]);

  // Sorting
  const sorted = useMemo(() => {
    const data = [...filtered];

    const getValue = (item) => {
      switch (sortField) {
        case "code":
          return item.code;
        case "program":
          return item.program;
        case "instructor":
          return item.instructor;
        case "status":
          return item.status;
        case "credits":
          return Number(item.credits);
        default:
          return item.title;
      }
    };

    data.sort((a, b) => {
      let aVal = getValue(a);
      let bVal = getValue(b);

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      aVal = (aVal || "").toString().toLowerCase();
      bVal = (bVal || "").toString().toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [filtered, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Courses List</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            type="button"
            onClick={() => navigate("/dashboardadmin/courses/add")}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Course
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">No courses found.</p>
      ) : (
        <>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                {[
                  ["code", "Code"],
                  ["title", "Title"],
                  ["program", "Program"],
                  ["instructor", "Instructor"],
                  ["credits", "Credits"],
                  ["status", "Status"],
                ].map(([field, label]) => (
                  <th
                    key={field}
                    className="py-3 px-2 cursor-pointer"
                    onClick={() => handleSort(field)}
                  >
                    <span className="inline-flex items-center">
                      {label}
                      <SortArrow
                        active={sortField === field}
                        direction={sortDirection}
                      />
                    </span>
                  </th>
                ))}
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{c.code}</td>
                  <td className="py-2 px-2">{c.title}</td>
                  <td className="py-2 px-2">{c.program}</td>
                  <td className="py-2 px-2">{c.instructor}</td>
                  <td className="py-2 px-2">{c.credits}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        c.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
                      onClick={() =>
                        navigate(`/dashboardadmin/courses/edit/${c.id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// STUDENTS TABLE
// ---------------------------------------------------------------------------
const StudentsOverviewTable = ({ users, coursesUsers }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const pageSize = 10;

// Build student rows with computed course count
// Filter to show only users with role === "student"
const studentRows = useMemo(() => {
  return users
    .filter((u) => u.role === "student") 
    .map((u) => ({
      id: u.studentId,
      name:
        u.displayName ||
        [u.firstName, u.lastName].filter(Boolean).join(" ") ||
        "Unnamed student",
      email: u.email,
      status: u.status,
      courses:
        coursesUsers.filter(
          (cu) => cu.user_id === u.id || cu.student_id === u.id
        ).length || 0,
    }));
}, [users, coursesUsers]);

  const handleSort = (field) => {
    setPage(1);
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDirection("asc");
      return field;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return studentRows.filter((s) => {
      const c = `${s.id} ${s.name} ${s.email}`.toLowerCase();
      return c.includes(q);
    });
  }, [studentRows, search]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();
      if (sortDirection === "asc") return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });
    return data;
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Students Overview</h2>

        <input
          type="text"
          placeholder="Search students..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">No students found.</p>
      ) : (
        <>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                {[
                  ["id", "Student ID"],
                  ["name", "Name"],
                  ["email", "Email"],
                  ["status", "Status"],
                  ["courses", "Courses"],
                ].map(([field, label]) => (
                  <th
                    key={field}
                    className="py-3 px-2 cursor-pointer"
                    onClick={() => handleSort(field)}
                  >
                    <span className="inline-flex items-center">
                      {label}
                      <SortArrow
                        active={sortField === field}
                        direction={sortDirection}
                      />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{s.id}</td>
                  <td className="py-2 px-2">{s.name}</td>
                  <td className="py-2 px-2">{s.email}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2 px-2">{s.courses}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN DASHBOARD PAGE
// ---------------------------------------------------------------------------

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesUsers, setCoursesUsers] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load all required data from backend API Endpoints
  useEffect(() => {
    async function load() {
      try {
        const [u, c, cu, p] = await Promise.all([
          fetch(buildApiUrl("getUsers")).then((r) => r.json()),
          fetch(buildApiUrl("getCourses")).then((r) => r.json()),
          fetch(buildApiUrl("getCoursesUsers")).then((r) => r.json()),
          fetch(buildApiUrl("getPrograms")).then((r) => r.json()),
        ]);

        // Global sorting by title
        setUsers(u || []);
        setCourses((c || []).sort((a, b) => a.title.localeCompare(b.title)));
        setCoursesUsers(cu || []);
        setPrograms((p.items || []).sort((a, b) => a.title.localeCompare(b.title)));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Overview metrics
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalCourses = courses.length;
  const totalPrograms = programs.length;
  const totalEnrollments = coursesUsers.length;

  // Average progress calculation
  const avgProgress = (() => {
    const progressValues = coursesUsers
      .map((r) => Number(r.progress))
      .filter((v) => !isNaN(v));

    if (!progressValues.length) return 0;

    const sum = progressValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / progressValues.length);
  })();

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">

      {/* Dashboard header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome, Admin BowProject
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage students, programs, courses, and enrollment data.
        </p>
        {currentUser?.email && (
          <p className="mt-1 text-xs text-gray-400">
            Logged in as {currentUser.email}
          </p>
        )}
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-10">
        <StatCard
          label="Total Students"
          value={totalStudents}
          helper="Active students in the system."
        />
        <StatCard
          label="Programs"
          value={totalPrograms}
          helper="Available programs."
        />
        <StatCard
          label="Courses Offered"
          value={totalCourses}
          helper="Courses registered in the system."
        />
        <StatCard
          label="Enrollments"
          value={totalEnrollments}
          helper="Total course enrollments."
        />
        <StatCard
          label="Avg Progress"
          value={`${avgProgress}%`}
          helper="Average student progress."
        />
      </div>

      {/* Programs Table */}
      <ProgramsTable programs={programs} navigate={navigate} />

      {/* Courses Table */}
      <CoursesTable courses={courses} navigate={navigate} />

      {/* Students Table */}
      <StudentsOverviewTable users={users} coursesUsers={coursesUsers} />
    </div>
  );
};

export default DashboardAdmin;
