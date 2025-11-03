import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import coursesData from "../../data/courses.json";

/*
  CourseEdit.jsx
  -----------------------------------
  - Unified Add/Edit Course form
  - Syncs with full JSON structure from courses.json
  - Auto-populates when editing an existing course
*/

const CourseEdit = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(code);

  const [course, setCourse] = useState({
    id: "",
    title: "",
    code: "",
    color: "",
    instructor: "",
    photo: "",
    schedule: "",
    credits: "",
    available: "",
    total: 25,
    term: "",
    start: "",
    end: "",
    description: "",
    program_id: "",
    programTitle: "",
    status: "inactive",
    duration: "",
    subjects_total: "",
    tuition_fee: "",
  });

  // Load existing course if editing
  useEffect(() => {
    if (isEditMode) {
      const foundCourse = coursesData.find((c) => c.code === code);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [code, isEditMode]);

  // Handle text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status checkbox
  const handleStatusChange = (e) => {
    setCourse((prev) => ({
      ...prev,
      status: e.target.checked ? "active" : "inactive",
    }));
  };

  // Handle program selection and assign both id and title
  const handleProgramChange = (e) => {
    const value = e.target.value;
    const programMap = {
      "1": "Diploma",
      "2": "Post-Diploma",
      "3": "Certificate",
    };
    setCourse((prev) => ({
      ...prev,
      program_id: value,
      programTitle: programMap[value] || "",
    }));
  };

  // Save or Add Course (mock)
  const handleSave = (e) => {
    e.preventDefault();
    if (isEditMode) {
      alert(`✅ Course "${course.title}" has been updated successfully!`);
    } else {
      alert(`✅ New course "${course.title}" has been added successfully!`);
    }
    navigate("/dashboardadmin");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TopBar />

      <main className="container mx-auto flex-1 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            {isEditMode
              ? `Edit Course: ${course.code}`
              : "Add New Course"}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Title + Status */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={course.status === "active"}
                  onChange={handleStatusChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={course.code}
                onChange={handleChange}
                disabled={isEditMode}
                placeholder="Enter course code"
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
                  isEditMode ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>

            {/* Instructor + Photo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instructor
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={course.instructor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                {/**
                <label className="block text-sm font-medium text-gray-700">
                  Photo URL
                </label>
                <input
                  type="url"
                  name="photo"
                  value={course.photo}
                  onChange={handleChange}
                  placeholder="https://i.pravatar.cc/40?img=1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
                */}
              </div>
            </div>

            {/* Program + Term + Duration */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Program
                </label>
                <select
                  name="program_id"
                  value={course.program_id}
                  onChange={handleProgramChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Select Program</option>
                  <option value="1">Diploma</option>
                  <option value="2">Post-Diploma</option>
                  <option value="3">Certificate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Term
                </label>
                <select
                  name="term"
                  value={course.term}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Select Term</option>
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Winter 2026">Winter 2026</option>
                  <option value="Spring 2026">Spring 2026</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <select
                  name="duration"
                  value={course.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Select Duration</option>
                  <option value="1 Term">1 Term</option>
                  <option value="2 Terms">2 Terms</option>
                  <option value="4 Terms">4 Terms</option>
                </select>
              </div>
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start"
                  value={course.start}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="end"
                  value={course.end}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>

            {/* Schedule + Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Schedule
                </label>
                <input
                  type="text"
                  name="schedule"
                  value={course.schedule}
                  onChange={handleChange}
                  placeholder="MWF 2:00–3:00 PM"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={course.color}
                  onChange={handleChange}
                  placeholder="blue, red, green..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>

            {/* Tuition + Subjects + Credits + Available */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tuition Fee
                </label>
                <input
                  type="text"
                  name="tuition_fee"
                  value={course.tuition_fee}
                  onChange={handleChange}
                  placeholder="$6,000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subjects Total
                </label>
                <input
                  type="number"
                  name="subjects_total"
                  value={course.subjects_total}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  value={course.credits}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available
                </label>
                <input
                  type="number"
                  name="available"
                  value={course.available}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={course.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter course description"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboardadmin")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isEditMode ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseEdit;
