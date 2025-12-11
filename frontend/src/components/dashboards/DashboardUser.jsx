import React, { useEffect, useState, useMemo } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../api";

const DashboardUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user?.student_id || user?.studentId || "";

  const [studentProgram, setStudentProgram] = useState(null);
  const [programStructure, setProgramStructure] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingCourseId, setSavingCourseId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const getTermNumber = (termName) => {
    if (!termName) return 0;
    const match = termName.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // --------------------------------------------------------------------------
  // Step 1 — Load Student Program
  // --------------------------------------------------------------------------
  useEffect(() => {
    const loadStudentProgram = async () => {
      try {
        const res = await fetch(
          buildApiUrl("getStudentProgram") + `?student_id=${studentId}`
        );
        const json = await res.json();

        if (!json?.success || !json.item) {
          navigate("/programregistration");
          return;
        }

        setStudentProgram(json.item);
      } catch (err) {
        console.error("Error loading student program:", err);
      }
    };

    if (studentId) loadStudentProgram();
  }, [studentId, navigate]);

  // Load student's courses
  const fetchStudentCourses = async () => {
    try {
      const res = await fetch(
        buildApiUrl("getStudentCourses") + `?studentId=${studentId}`
      );
      const json = await res.json();

      setStudentCourses(Array.isArray(json.items) ? json.items : []);
    } catch (err) {
      console.error("Error loading student courses:", err);
    }
  };

  // --------------------------------------------------------------------------
  // Step 2 — Load program structure, courses, and enrollments
  // --------------------------------------------------------------------------
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!studentProgram) return;

      setLoading(true);
      resetFeedback();

      try {
        const [structRes, coursesRes, studentCoursesRes] = await Promise.all([
          fetch(
            buildApiUrl("getProgramStructureById") +
              `?id=${studentProgram.program_id}`
          ),
          fetch(buildApiUrl("getCourses")),
          fetch(buildApiUrl("getStudentCourses") + `?studentId=${studentId}`),
        ]);

        const structJson = await structRes.json();
        const coursesJson = await coursesRes.json();
        const studentCoursesJson = await studentCoursesRes.json();

        setProgramStructure(structJson?.item || null);
        setAllCourses(Array.isArray(coursesJson.items) ? coursesJson.items : coursesJson);
        setStudentCourses(
          Array.isArray(studentCoursesJson.items)
            ? studentCoursesJson.items
            : []
        );
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [studentProgram, studentId]);

  // --------------------------------------------------------------------------
  // Derived Data
  // --------------------------------------------------------------------------
  const enrolledCourseIds = useMemo(
    () =>
      new Set(
        studentCourses
          .filter(
            (sc) =>
              sc.status === "registered" ||
              sc.status === "completed" ||
              sc.completed === true
          )
          .map((sc) => sc.course_id)
      ),
    [studentCourses]
  );

  const overview = useMemo(() => {
    if (!Array.isArray(studentCourses) || !Array.isArray(allCourses)) {
      return {
        totalCredits: 0,
        completedCredits: 0,
        remainingCredits: 60,
        gpa: 0,
      };
    }

    const joined = studentCourses.map((sc) => ({
      sc,
      course: allCourses.find((c) => c.id === sc.course_id),
    }));

    const totalCredits = joined
      .filter(
        ({ sc }) =>
          sc.status === "registered" ||
          sc.status === "completed" ||
          sc.completed === true
      )
      .reduce((sum, { course }) => sum + (course?.credits || 0), 0);

    const completed = joined.filter(
      ({ sc }) => sc.status === "completed" || sc.completed === true
    );

    const completedCredits = completed.reduce(
      (sum, { course }) => sum + (course?.credits || 0),
      0
    );

    const totalGradePoints = completed.reduce(
      (sum, { sc }) => sum + (Number(sc.grade_points) || 0),
      0
    );

    const gpa =
      completed.length > 0
        ? Number((totalGradePoints / completed.length).toFixed(2))
        : 0;

    return {
      totalCredits,
      completedCredits,
      remainingCredits: Math.max(0, 60 - totalCredits),
      gpa,
    };
  }, [studentCourses, allCourses]);

  const gpaClass =
    overview.gpa >= 3
      ? "text-green-600"
      : overview.gpa >= 2
      ? "text-yellow-600"
      : "text-red-600";

  const gpaBadge =
    overview.gpa >= 3.7
      ? { text: "Honor Roll", color: "bg-green-100 text-green-700" }
      : overview.gpa >= 3
      ? { text: "Good Standing", color: "bg-blue-100 text-blue-700" }
      : overview.gpa >= 2
      ? { text: "Satisfactory", color: "bg-yellow-100 text-yellow-700" }
      : { text: "Academic Warning", color: "bg-red-100 text-red-700" };

  const termsView = useMemo(() => {
    if (!programStructure?.terms) return [];

    return programStructure.terms.map((term) => {
      const termCourses =
        term.courses?.map((tc) => {
          const full = allCourses.find((c) => c.id === tc.course_id);
          return {
            course_id: tc.course_id,
            course_code: tc.course_code,
            course_title: tc.course_title,
            order: tc.order || 0,
            isEnrolled: enrolledCourseIds.has(tc.course_id),
            ...full,
          };
        }) || [];

      termCourses.sort((a, b) => (a.order || 0) - (b.order || 0));

      return {
        termName: term.term_name || term.term || "Term",
        courses: termCourses,
      };
    });
  }, [programStructure, allCourses, enrolledCourseIds]);

  const currentTermNumber = getTermNumber(studentProgram?.current_term);

  // --------------------------------------------------------------------------
  // Enroll Button
  // --------------------------------------------------------------------------
  const handleEnroll = async (course) => {
    resetFeedback();

    if (!studentProgram) {
      setError("Student program not found.");
      return;
    }

    if (enrolledCourseIds.has(course.course_id)) {
      setError("You are already enrolled.");
      return;
    }

    setSavingCourseId(course.course_id);

    try {
      const payload = {
        student_id: studentId,
        program_id: studentProgram.program_id,
        course_id: course.course_id,
        term: studentProgram.current_term,
      };

      const res = await fetch(buildApiUrl("registerStudentCourse"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json?.success) {
        setError(json.message || "Failed to enroll.");
        return;
      }

      await fetchStudentCourses();
      setMessage(`You are now enrolled in ${course.title || course.course_title}.`);
    } catch (err) {
      console.error("Enroll error:", err);
      setError("Error enrolling in course.");
    } finally {
      setSavingCourseId("");
    }
  };

  // --------------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------------
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopBar />

      <main className="container mx-auto flex-1 px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.firstName || "Student"}!
            </h2>
            <p className="mt-1 text-gray-500">Ready to continue your studies?</p>
          </div>

          <div className="mt-4 text-right md:mt-0">
            <p className="text-gray-600">
              <span className="font-semibold">{user?.role}</span> Dashboard
            </p>
            <p className="text-sm text-gray-400">
              Logged in as {user?.firstName} {user?.lastName} (ID:{" "}
              {user?.studentId})
            </p>
          </div>
        </div>

        {/* Feedback */}
        {message && (
          <div className="mb-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        ) : (
          <>
            {/* Academic Overview */}
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Academic Overview
            </h3>

            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h4 className="text-2xl font-bold">{overview.totalCredits}</h4>
                <p className="text-sm text-gray-500">Total Credits</p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h4 className={`text-2xl font-bold ${gpaClass}`}>
                  {overview.gpa}
                </h4>
                <p className="text-sm text-gray-500">GPA</p>

                <span
                  className={`mt-2 inline-block rounded-lg px-2 py-1 text-xs font-semibold ${gpaBadge.color}`}
                >
                  {gpaBadge.text}
                </span>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h4 className="text-2xl font-bold">{overview.completedCredits}</h4>
                <p className="text-sm text-gray-500">Completed Credits</p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h4 className="text-2xl font-bold">{overview.remainingCredits}</h4>
                <p className="text-sm text-gray-500">Remaining Credits</p>

                <div className="mt-2 h-2 w-full rounded bg-gray-200">
                  <div
                    className="h-2 rounded bg-blue-600"
                    style={{
                      width: `${(overview.totalCredits / 60) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Program Structure */}
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Program Structure – {studentProgram.program_title}
            </h3>

            <div className="space-y-10">
              {termsView.map((term, idx) => {
                const termNumber = getTermNumber(term.termName);
                const isFutureTerm = termNumber > currentTermNumber;
                const isPastTerm = termNumber < currentTermNumber;
                const isCurrentTerm = termNumber === currentTermNumber;

                return (
                  <section key={idx}>
                    <h4 className="mb-3 text-md font-semibold text-gray-800">
                      {term.termName}{" "}
                      {isFutureTerm && "(Upcoming)"}
                      {isPastTerm && "(Completed)"}
                    </h4>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      {term.courses.map((course) => {
                        const isEnrolled = course.isEnrolled;
                        const isSaving = savingCourseId === course.course_id;

                        // *****************************************************
                        // STATUS LOGIC — updated to include "Completed"
                        // *****************************************************

                        // Find student's record for this course
                        const studentCourse = studentCourses.find(
                          (sc) => sc.course_id === course.course_id
                        );

                        let statusLabel = "Not enrolled";
                        let statusColor = "bg-gray-100 text-gray-600";

                        /*
                          Completed Status
                          If the student finished the course, show Completed.
                        */
                        if (
                          studentCourse?.status === "completed" ||
                          studentCourse?.completed === true
                        ) {
                          statusLabel = "Completed";
                          statusColor = "bg-blue-100 text-blue-700";

                        /*
                          Enrolled Status
                          Normal enrollment state.
                        */
                        } else if (isEnrolled) {
                          statusLabel = "Enrolled";
                          statusColor = "bg-green-100 text-green-600";

                        /*
                          Inactive Status
                          Future term courses cannot be enrolled yet.
                        */
                        } else if (isFutureTerm) {
                          statusLabel = "Inactive";
                          statusColor = "bg-yellow-100 text-yellow-700";
                        }

                        // *****************************************************

                        const canEnroll =
                          isCurrentTerm &&
                          !isEnrolled &&
                          !isSaving &&
                          statusLabel !== "Completed";

                        return (
                          <div
                            key={course.course_id}
                            className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                          >
                            <div>
                              <div className="mb-2 flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-gray-900">
                                  {course.title || course.course_title}
                                </h5>

                                <span
                                  className={`rounded-lg px-2 py-1 text-xs font-medium ${statusColor}`}
                                >
                                  {statusLabel}
                                </span>
                              </div>

                              <p className="text-xs text-gray-500">
                                {course.code || course.course_code} •{" "}
                                {course.credits || 0} Credits
                              </p>

                              <p className="mt-2 text-xs text-gray-600">
                                Instructor: {course.instructor || "TBA"}
                              </p>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                              <button
                                disabled={!canEnroll}
                                className={`w-full rounded-lg py-2 text-xs font-medium transition ${
                                  canEnroll
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => handleEnroll(course)}
                              >
                                {isSaving
                                  ? "Processing..."
                                  : isFutureTerm
                                  ? "Inactive"
                                  : "Enroll"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardUser;
