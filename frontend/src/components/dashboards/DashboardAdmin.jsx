// ---------------------------------------------------------------------------
// DashboardAdmin.jsx
// ---------------------------------------------------------------------------
// Admin dashboard that shows:
// - Overview metrics (students, programs, courses, enrollments, avg progress)
// Uses backend API endpoints: getUsers, getCourses, getStudentCourses, getPrograms
// ---------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../api";

const StatCard = ({ label, value, helper }) => (
  <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
    {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goTo = (p) => { if (p < 1 || p > totalPages) return; onPageChange(p); };
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
      <div>Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span></div>
      <div className="flex gap-2">
        <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}
          className={`px-3 py-1 rounded border text-sm ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
          Previous
        </button>
        <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border text-sm ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
          Next
        </button>
      </div>
    </div>
  );
};

const SortArrow = ({ active, direction }) => {
  if (!active) return <span className="ml-1 text-gray-300">↕</span>;
  return <span className="ml-1 text-gray-500">{direction === "asc" ? "↑" : "↓"}</span>;
};

// PROGRAMS TABLE --------------------------------------------------------------
const ProgramsTable = ({ programs, navigate }) => {
  const [search, setSearch] = useState(""); const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc"); const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSort = (field) => {
    setPage(1);
    setSortField((prev) => {
      if (prev === field) { setSortDirection((d) => (d === "asc" ? "desc" : "asc")); return prev; }
      setSortDirection("asc"); return field;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return programs.filter((p) => `${p.title} ${p.credential} ${p.area} ${p.school}`.toLowerCase().includes(q));
  }, [programs, search]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    const getVal = (p) => {
      switch (sortField) {
        case "credential": return p.credential;
        case "duration": return p.duration;
        case "terms": return p.program_length;
        case "area": return p.area;
        case "school": return p.school;
        default: return p.title;
      }
    };
    data.sort((a, b) => {
      let av = getVal(a), bv = getVal(b);
      if (typeof av === "number" && typeof bv === "number") return sortDirection === "asc" ? av - bv : bv - av;
      av = (av || "").toString().toLowerCase(); bv = (bv || "").toString().toLowerCase();
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Programs List</h2>
        <div className="flex gap-3">
          <input type="text" placeholder="Search..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <button onClick={() => navigate("/dashboardadmin/programs/add")}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
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
                {[
                  ["title", "Title"],
                  ["credential", "Credential"],
                  ["duration", "Duration"],
                  ["terms", "Terms"],
                  ["area", "Area"],
                  ["school", "School"],
                ].map(([field, label]) => (
                  <th key={field} className="py-3 px-2 cursor-pointer" onClick={() => handleSort(field)}>
                    <span className="inline-flex items-center">
                      {label}
                      <SortArrow active={sortField === field} direction={sortDirection} />
                    </span>
                  </th>
                ))}
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{p.title}</td>
                  <td className="py-2 px-2">{p.credential}</td>
                  <td className="py-2 px-2">{p.duration}</td>
                  <td className="py-2 px-2">{p.program_length || "N/A"}</td>
                  <td className="py-2 px-2">{p.area}</td>
                  <td className="py-2 px-2">{p.school}</td>
                  <td className="py-2 px-2">
                    <button onClick={() => navigate(`/dashboardadmin/programs/edit/${p.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

// COURSES TABLE --------------------------------------------------------------
const CoursesTable = ({ courses, navigate }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("code");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const handleSort = (field) => {
    setPage(1);
    setSortField((prev) => {
      if (prev === field) { setSortDirection((d) => (d === "asc" ? "desc" : "asc")); return prev; }
      setSortDirection("asc"); return field;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter((c) => `${c.code} ${c.title} ${c.instructor}`.toLowerCase().includes(q));
  }, [courses, search]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    const getValue = (item) => {
      switch (sortField) {
        case "title": return item.title;
        case "instructor": return item.instructor;
        case "credits": return Number(item.credits);
        case "active": return item.is_active ? 1 : 0;
        default: return item.code;
      }
    };
    data.sort((a, b) => {
      let av = getValue(a), bv = getValue(b);
      if (typeof av === "number" && typeof bv === "number") return sortDirection === "asc" ? av - bv : bv - av;
      av = (av || "").toString().toLowerCase(); bv = (bv || "").toString().toLowerCase();
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Courses List</h2>
        <div className="flex gap-3">
          <input type="text" placeholder="Search..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />

          <button onClick={() => navigate("/dashboardadmin/courses/add")}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
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
                  ["instructor", "Instructor"],
                  ["credits", "Credits"],
                  ["active", "Active"],
                ].map(([field, label]) => (
                  <th key={field} className="py-3 px-2 cursor-pointer" onClick={() => handleSort(field)}>
                    <span className="inline-flex items-center">
                      {label}
                      <SortArrow active={sortField === field} direction={sortDirection} />
                    </span>
                  </th>
                ))}
                <th className="py-3 px-2">Show on Home</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{c.code}</td>
                  <td className="py-2 px-2">{c.title}</td>
                  <td className="py-2 px-2">{c.instructor}</td>
                  <td className="py-2 px-2">{c.credits}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${c.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${c.show_on_homepage ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>
                      {c.show_on_homepage ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <button onClick={() => navigate(`/dashboardadmin/courses/edit/${c.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

// STUDENTS TABLE --------------------------------------------------------------
const StudentsOverviewTable = ({ users, coursesUsers }) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const studentRows = useMemo(() => {
    return users
      .filter((u) => u.role === "student")
      .map((u) => ({
        id: u.studentId,
        name: u.displayName || [u.firstName, u.lastName].filter(Boolean).join(" ") || "Unnamed student",
        email: u.email,
        status: u.status,
        courses: coursesUsers.filter((cu) => cu.student_id === u.studentId).length,
      }));
  }, [users, coursesUsers]);

  const handleSort = (field) => {
    setPage(1);
    setSortField((prev) => {
      if (prev === field) { setSortDirection((d) => (d === "asc" ? "desc" : "asc")); return prev; }
      setSortDirection("asc"); return field;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return studentRows.filter((s) => `${s.id} ${s.name} ${s.email}`.toLowerCase().includes(q));
  }, [studentRows, search]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      const av = (a[sortField] || "").toString().toLowerCase();
      const bv = (b[sortField] || "").toString().toLowerCase();
      return sortDirection === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
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

        <input type="text" placeholder="Search students..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
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
                  <th key={field} className="py-3 px-2 cursor-pointer" onClick={() => handleSort(field)}>
                    <span className="inline-flex items-center">{label}
                      <SortArrow active={sortField === field} direction={sortDirection} />
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
                    <span className={`px-2 py-1 rounded-full text-xs ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2 px-2">{s.courses}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

// MAIN ADMIN DASHBOARD -------------------------------------------------------
const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesUsers, setCoursesUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Support Messages (Admin)
  const [adminMessageCounts, setAdminMessageCounts] = useState({
    total: 0,
    pending: 0,
    answered: 0,
  });


  useEffect(() => {
    async function load() {
      try {
        const [usersRes, coursesRes, programsRes] = await Promise.all([
          fetch(buildApiUrl("getUsers")).then((r) => r.json()),
          fetch(buildApiUrl("getCourses")).then((r) => r.json()),
          fetch(buildApiUrl("getPrograms")).then((r) => r.json()),
        ]);

        const usersData = usersRes.items || usersRes || [];
        const programsData = (programsRes.items || []).map((p) => ({
          id: p.id, title: p.title, description: p.description, credential: p.credential,
          duration: p.duration, program_length: p.program_length, area: p.area,
          school: p.school, color: p.color, icon: p.icon,
        }));
        const coursesData = (coursesRes.items || []).map((c) => ({
          id: c.id, code: c.code, title: c.title, instructor: c.instructor, credits: c.credits,
          color: c.color, icon: c.icon, is_active: c.is_active, show_on_homepage: c.show_on_homepage,
        }));

        setUsers(usersData);
        setPrograms(programsData.sort((a, b) => (a.title || "").localeCompare(b.title || "")));
        setCourses(coursesData.sort((a, b) => (a.title || "").localeCompare(b.title || "")));

        const students = usersData.filter((u) => u.role === "student");
        let allEnrollments = [];

        for (const student of students) {
          const sid = student.studentId;
          if (!sid) continue;

          const res = await fetch(buildApiUrl("getStudentCourses") + `?studentId=${sid}`);
          const json = await res.json();

          if (Array.isArray(json.items)) {
            const normalized = json.items.map((item) => ({
              ...item,
              student_id: sid,
            }));
            allEnrollments.push(...normalized);
          }
        }

        setCoursesUsers(allEnrollments);

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalCourses = courses.length;
  const totalPrograms = programs.length;
  const totalEnrollments = coursesUsers.length;

  const avgProgress = (() => {
    if (!coursesUsers.length) return 0;
    const progressList = coursesUsers.map((r) =>
      r.status === "completed" || r.completed === true ? 100 : 0
    );
    const sum = progressList.reduce((a, b) => a + b, 0);
    return Math.round(sum / progressList.length);
  })();



  const loadMessages = async () => {
    try {
      const res = await fetch(buildApiUrl("getAllMessages"));
      const json = await res.json();

      if (json.success && Array.isArray(json.items)) {
        const messages = json.items;

        const total = messages.length;
        const pending = messages.filter(
          (m) => m.status === "unread"
        ).length;
        const answered = messages.filter(
          (m) => m.status === "answered"
        ).length;

        setAdminMessageCounts({ total, pending, answered });
      }
    } catch (err) {
      console.error("Failed to load admin messages", err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);    


  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, Admin BowProject</h2>
        <p className="text-sm text-gray-500 mt-1">Manage students, programs, courses, and enrollment data.</p>
        {currentUser?.email && <p className="mt-1 text-xs text-gray-400">Logged in as {currentUser.email}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-10">
        <StatCard label="Total Students" value={totalStudents} helper="Active students in the system." />
        <StatCard label="Programs" value={totalPrograms} helper="Available programs." />
        <StatCard label="Courses Offered" value={totalCourses} helper="Courses registered in the system." />
        <StatCard label="Enrollments" value={totalEnrollments} helper="Total course enrollments." />
        <StatCard label="Avg Progress" value={`${avgProgress}%`} helper="Average student progress." />

        {/* Support Messages */}
        <div
          onClick={() => navigate("/dashboardadmin/messages")}
          className="cursor-pointer rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-600">
              Support Messages
            </h3>
            <span className="material-symbols-outlined text-blue-500">
              support_agent
            </span>
          </div>

          <div className="flex justify-between text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {adminMessageCounts.total}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {adminMessageCounts.pending}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-green-600">
                {adminMessageCounts.answered}
              </div>
              <div className="text-xs text-gray-500">Answered</div>
            </div>
          </div>
        </div>

      </div>

      <ProgramsTable programs={programs} navigate={navigate} />
      <CoursesTable courses={courses} navigate={navigate} />
      <StudentsOverviewTable users={users} coursesUsers={coursesUsers} />
    </div>
  );
};

export default DashboardAdmin;
