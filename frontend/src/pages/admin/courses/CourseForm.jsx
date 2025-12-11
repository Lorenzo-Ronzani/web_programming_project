import React, { useState, useEffect } from "react";

export default function CourseForm({ initialData = null, onSubmit }) {
  const [form, setForm] = useState({
    code: "",
    title: "",
    instructor: "",
    photo: "",
    details: "", 
    color: "indigo",
    icon: "school",
    credits: 0,
    is_active: true,
    show_on_homepage: false,
  });


  // Load initial data (Edit mode)
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const COLORS = [
    "cyan",
    "red",
    "orange",
    "indigo",
    "green",
    "violet",
    "teal",
    "blue",
    "gray",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* ===========================
          SECTION 1 — BASIC INFORMATION
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Course Code */}
          <div>
            <label className="block font-medium mb-1">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              placeholder="Ex: SODV1101"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Course Title */}
          <div>
            <label className="block font-medium mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Ex: Web and Internet Fundamentals"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            />
          </div>

        </div>
      </div>

      {/* ===========================
          SECTION 2 — INSTRUCTOR
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Instructor Information</h2>

        <div className="space-y-6">

          {/* Instructor */}
          <div>
            <label className="block font-medium mb-1">Instructor Name</label>
            <input
              type="text"
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              placeholder="Ex: Dr. Roy Fielding"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block font-medium mb-1">Photo URL</label>
            <input
              type="text"
              name="photo"
              value={form.photo}
              onChange={handleChange}
              placeholder="Ex: https://i.pravatar.cc/100?img=5"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            />

            {/* Preview */}
            {form.photo ? (
              <img
                src={form.photo}
                alt="Preview"
                className="mt-3 w-24 h-24 rounded-full object-cover border shadow"
              />
            ) : (
              <p className="text-gray-500 text-sm mt-1">No photo preview available</p>
            )}
          </div>

          {/* DETAILS */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Course Details</label>
            <textarea
              className="w-full border rounded p-3 h-32"
              placeholder="Additional course description..."
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
          </div>

        </div>
      </div>

      {/* ===========================
          SECTION 3 — VISUAL SETTINGS
      ============================ */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Visual Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Color */}
          <div>
            <label className="block font-medium mb-1">Card Color</label>
            <select
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="block font-medium mb-1">
              Icon{" "}
              <a
                href="https://fonts.google.com/icons?selected=Material+Symbols+Outlined"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 underline text-sm ml-1"
              >
                (Browse Icons)
              </a>
            </label>
            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="Ex: school, code, security"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
            />
          </div>

        </div>

        {/* Credits */}
        <div className="mt-6">
          <label className="block font-medium mb-1">Credits</label>
          <input
            type="number"
            name="credits"
            value={form.credits}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"
          />
        </div>

        {/* Switches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Active */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Active
          </label>

          {/* Show on homepage */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_on_homepage"
              checked={form.show_on_homepage}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Show on homepage
          </label>

        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
        >
          Save Course
        </button>
      </div>

    </form>
  );
}
