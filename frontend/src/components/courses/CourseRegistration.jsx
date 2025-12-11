import React, { useEffect, useState } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../api";

// Gradiente suave
const COLOR_GRADIENT = {
  blue: "from-blue-500/70 to-blue-500/90",
  green: "from-green-500/70 to-green-500/90",
  purple: "from-purple-500/70 to-purple-500/90",
  yellow: "from-yellow-500/70 to-yellow-500/90",
  red: "from-red-500/70 to-red-500/90",
  indigo: "from-indigo-500/70 to-indigo-500/90",
  cyan: "from-cyan-500/70 to-cyan-500/90",
  orange: "from-orange-500/70 to-orange-500/90",
  teal: "from-teal-500/70 to-teal-500/90",
  pink: "from-pink-500/70 to-pink-500/90",
  emerald: "from-emerald-500/70 to-emerald-500/90",
  violet: "from-violet-500/70 to-violet-500/90",
  rose: "from-rose-500/70 to-rose-500/90",
  amber: "from-amber-500/70 to-amber-500/90",
  lime: "from-lime-500/70 to-lime-500/90",
  slate: "from-slate-500/70 to-slate-500/90",
  fuchsia: "from-fuchsia-500/70 to-fuchsia-500/90",
  sky: "from-sky-500/70 to-sky-500/90",
  stone: "from-stone-500/70 to-stone-500/90",
  neutral: "from-neutral-500/70 to-neutral-500/90",
};

const CourseRegistration = () => {
  const { user } = useAuth();
  const studentId = user?.student_id || user?.studentId || "";

  const [studentProgram, setStudentProgram] = useState(null);
  const [courses, setCourses] = useState([]);

  // Mapa: { [courseId]: "registered" | "completed" }
  const [studentCourseStatus, setStudentCourseStatus] = useState({});

  const [loading, setLoading] = useState(true);
  const [savingCourseId, setSavingCourseId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  // ------------------------------------------------------------
  // Load student program
  // ------------------------------------------------------------
  useEffect(() => {
    const loadStudentProgram = async () => {
      try {
        const res = await fetch(
          buildApiUrl("getStudentProgram") + `?student_id=${studentId}`
        );
        const json = await res.json();

        if (!json?.success || !json.item) {
          window.location.href = "/programregistration";
          return;
        }

        setStudentProgram(json.item);
      } catch (err) {
        console.error(err);
      }
    };

    if (studentId) loadStudentProgram();
  }, [studentId]);

  // ------------------------------------------------------------
  // Load courses for current term
  // ------------------------------------------------------------
  useEffect(() => {
    const loadCoursesForTerm = async () => {
      if (!studentProgram) return;

      setLoading(true);

      try {
        const structRes = await fetch(
          buildApiUrl("getProgramStructureById") +
            `?id=${studentProgram.program_id}`
        );
        const structJson = await structRes.json();

        if (!structJson?.success || !structJson.item?.terms) {
          setError("Program structure not found.");
          setCourses([]);
          setLoading(false);
          return;
        }

        const struct = structJson.item;
        const termLabel = studentProgram.current_term || "Term 1";

        const termEntry =
          struct.terms.find((t) => t.term === termLabel) || struct.terms[0];

        if (!termEntry?.courses) {
          setCourses([]);
          setLoading(false);
          return;
        }

        const termCourseIds = termEntry.courses.map((c) => c.course_id);

        const courseRes = await fetch(buildApiUrl("getCourses"));
        const courseJson = await courseRes.json();

        const allCourses = Array.isArray(courseJson.items)
          ? courseJson.items
          : courseJson;

        const filtered = allCourses.filter((c) => termCourseIds.includes(c.id));

        setCourses(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCoursesForTerm();
  }, [studentProgram]);

  // ------------------------------------------------------------
  // Load student's course statuses (registered + completed)
  // ------------------------------------------------------------
  const loadStudentCourses = async () => {
    try {
      const res = await fetch(
        buildApiUrl("getStudentCourses") + `?studentId=${studentId}` // FIXED HERE
      );
      const json = await res.json();

      if (!json?.success) return;

      const raw = Array.isArray(json.items) ? json.items : [];

      const map = {};

      raw.forEach((c) => {
        const courseId =
          c.course_id ??
          c.courseId ??
          (c.course && c.course.id) ??
          c.id;

        if (!courseId) return;

        const status = c.status ?? "registered";

        map[courseId] = status;
      });

      setStudentCourseStatus(map);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (studentId) loadStudentCourses();
  }, [studentId]);

  // ------------------------------------------------------------
  // Register in course
  // ------------------------------------------------------------
  const handleRegister = async (course) => {
    resetFeedback();

    const id = course.id;
    const status = studentCourseStatus[id];

    if (status === "registered" || status === "completed") {
      setError("You cannot register again for this course.");
      return;
    }

    setSavingCourseId(id);

    try {
      const payload = {
        student_id: studentId,
        program_id: studentProgram.program_id,
        course_id: id,
        term: studentProgram.current_term || null,
      };

      const res = await fetch(buildApiUrl("registerStudentCourse"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json?.success) {
        setError(json.message || "Failed to register course.");
        return;
      }

      await loadStudentCourses();

      setMessage(`Registered in ${course.title}`);
    } catch (err) {
      console.error(err);
      setError("Error registering course.");
    } finally {
      setSavingCourseId("");
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  if (!studentProgram) return <div>Loading program...</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h1 className="text-xl font-semibold">
            {studentProgram.program_title} ({studentProgram.credential})
          </h1>
          <p>Term: {studentProgram.current_term}</p>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const status = studentCourseStatus[course.id];

              const isRegistered = status === "registered";
              const isCompleted = status === "completed";

              const cardClass = isCompleted
                ? "bg-gray-200 text-gray-800 border border-gray-300"
                : isRegistered
                ? "bg-gray-100 text-gray-800 border border-gray-200"
                : `text-white bg-gradient-to-br ${
                    COLOR_GRADIENT[course.color] || COLOR_GRADIENT.blue
                  }`;

              const buttonLabel = isCompleted
                ? "Completed"
                : isRegistered
                ? "Registered"
                : savingCourseId === course.id
                ? "Registering..."
                : "Register";

              const buttonClass = isCompleted
                ? "bg-gray-400 cursor-not-allowed"
                : isRegistered
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600";

              return (
                <div
                  key={course.id}
                  className={`rounded-2xl shadow-lg p-6 flex flex-col justify-between ${cardClass}`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {course.icon && (
                        <span
                          className="material-symbols-outlined text-4xl"
                          style={{
                            color:
                              isCompleted || isRegistered
                                ? "#444"
                                : "rgba(255,255,255,0.85)",
                          }}
                        >
                          {course.icon}
                        </span>
                      )}
                      <h2 className="text-lg font-semibold">
                        {course.title}
                      </h2>
                    </div>

                    <p className="text-sm opacity-90">{course.code}</p>

                    <div className="mt-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-lg ${
                          isCompleted || isRegistered
                            ? "bg-gray-300 text-gray-700"
                            : "bg-black/40 text-white"
                        }`}
                      >
                        {course.credits} credits
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <img
                        src={course.photo}
                        className="w-11 h-11 rounded-full object-cover border shadow-md"
                        alt="Instructor"
                      />
                      <p className="text-sm">
                        Instructor: <b>{course.instructor}</b>
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={
                      isRegistered || isCompleted || savingCourseId === course.id
                    }
                    onClick={() => handleRegister(course)}
                    className={`mt-6 w-full py-2 rounded-xl text-sm font-semibold text-white shadow-md ${buttonClass}`}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CourseRegistration;
