import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../../api";

// Standard North American letter grade mapping
const gradeMap = {
  "A+": { numeric: 97, points: 4.0 },
  A: { numeric: 92, points: 4.0 },
  "A-": { numeric: 87, points: 3.7 },
  "B+": { numeric: 82, points: 3.3 },
  B: { numeric: 77, points: 3.0 },
  "B-": { numeric: 72, points: 2.7 },
  "C+": { numeric: 68, points: 2.3 },
  C: { numeric: 65, points: 2.0 },
  "C-": { numeric: 61, points: 1.7 },
  D: { numeric: 55, points: 1.0 },
  F: { numeric: 40, points: 0.0 },
};

const AdminStudentCourseEditor = () => {
  const { id, courseId } = useParams(); // id = studentId, courseId = studentCourse document ID
  const navigate = useNavigate();

  const [courseRecord, setCourseRecord] = useState(null); // studentCourses record
  const [catalogCourse, setCatalogCourse] = useState(null); // course details from course catalog

  const [letterGrade, setLetterGrade] = useState("");
  const [numericGrade, setNumericGrade] = useState("");
  const [gradePoints, setGradePoints] = useState("");
  const [completed, setCompleted] = useState(false);

  // Load student course record + main course data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Step 1: Load all studentCourses for this student
        const res = await fetch(
          buildApiUrl("getStudentCourses") + `?studentId=${id}`
        );
        const json = await res.json();
        const list = json.items || json;

        // Step 2: Select the specific studentCourses document based on URL courseId
        const selected = list.find((c) => c.id === courseId);

        if (!selected) {
          console.error("Student course record not found.");
          return;
        }

        setCourseRecord(selected);

        // Step 3: Load entire course catalog
        const catalogRes = await fetch(buildApiUrl("getCourses"));
        const catalogJson = await catalogRes.json();
        const catalogList = catalogJson.items || catalogJson;

        // Step 4: Match with the correct course using the FK: selected.course_id
        const foundCourse = catalogList.find(
          (c) => c.id === selected.course_id
        );

        setCatalogCourse(foundCourse);

        // Step 5: Pre-fill form fields
        setLetterGrade(selected.letter_grade || "");
        setNumericGrade(selected.numeric_grade || "");
        setGradePoints(selected.grade_points || "");
        setCompleted(selected.status === "completed");
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id, courseId]);

  // Update secondary fields when letter grade changes
  const handleLetterChange = (value) => {
    setLetterGrade(value);

    if (gradeMap[value]) {
      setNumericGrade(gradeMap[value].numeric);
      setGradePoints(gradeMap[value].points);
      setCompleted(gradeMap[value].points > 0);
    }
  };

  // Save the updated grade
    const save = async () => {
    const payload = {
        id: courseId,   // <-- O backend PRECISA disso
        numeric_grade: numericGrade,
        letter_grade: letterGrade,
        grade_points: gradePoints,
        completed: completed
    };

    await fetch(buildApiUrl("updateStudentCourseGrade"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    navigate(`/dashboardadmin/students/${id}`);
    };


  if (!courseRecord || !catalogCourse) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-6">
        Edit Grade — {catalogCourse.title}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-xl">

        {/* Letter Grade */}
        <label className="block text-sm font-medium mb-1">Letter Grade</label>
        <select
          value={letterGrade}
          onChange={(e) => handleLetterChange(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        >
          <option value="">Choose...</option>
          {Object.keys(gradeMap).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Numeric Grade */}
        <label className="block text-sm font-medium mb-1">Numeric Grade</label>
        <input
          type="number"
          readOnly
          value={numericGrade}
          className="border rounded p-2 w-full mb-4 bg-gray-100"
        />

        {/* Grade Points */}
        <label className="block text-sm font-medium mb-1">Grade Points</label>
        <input
          type="text"
          readOnly
          value={gradePoints}
          className="border rounded p-2 w-full mb-4 bg-gray-100"
        />

        {/* Completed checkbox */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Completed
        </label>

        {/* Save button */}
        <button
          onClick={save}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Save Grade
        </button>

      </div>
    </div>
  );
};

export default AdminStudentCourseEditor;
