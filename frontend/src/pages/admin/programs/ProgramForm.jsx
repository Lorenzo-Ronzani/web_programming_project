// src/pages/admin/programs/ProgramForm.jsx
import React, { useState, useEffect } from "react";

const ProgramForm = ({ initialData, onSubmit }) => {
  // Initial form state
  const [form, setForm] = useState({
    title: "",
    credential: "Diploma",
    program_length: "",
    area: "",
    school: "",
    color: "",
    icon: "",
    duration: "",
    description: "",
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        credential: initialData.credential || "Diploma",
        program_length: initialData.program_length
          ? String(initialData.program_length)
          : "",
        area: initialData.area || "",
        school: initialData.school || "",
        color: initialData.color || "",
        icon: initialData.icon || "",
        duration: initialData.duration || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  // Handles form field updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Extracts only the first number found in a text
  const extractNumber = (text) => {
    if (!text) return 0;
    const match = String(text).match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      credential: form.credential,
      program_length: extractNumber(form.program_length),
      area: form.area,
      school: form.school,
      color: form.color,
      icon: form.icon,
      duration: form.duration,
      description: form.description,
    };

    onSubmit(payload);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-2 rounded"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Credential */}
        <div>
          <label className="block font-semibold mb-1">Credential</label>
          <select
            name="credential"
            className="w-full border p-2 rounded"
            value={form.credential}
            onChange={handleChange}
            required
          >
            <option value="Diploma">Diploma</option>
            <option value="Certificate">Certificate</option>
            <option value="Post-diploma">Post-diploma</option>
          </select>
        </div>

        {/* Program Length (only numbers are saved) */}
        <div>
          <label className="block font-semibold mb-1">Program Length</label>
          <input
            type="text"
            name="program_length"
            placeholder="Ex: 4 Terms"
            className="w-full border p-2 rounded"
            value={form.program_length}
            onChange={handleChange}
            required
          />
          <p className="text-sm text-gray-500">
            Only the numeric value will be stored. Example: "4 Terms" becomes 4.
          </p>
        </div>

        {/* Area */}
        <div>
          <label className="block font-semibold mb-1">Area</label>
          <select
            name="area"
            className="w-full border p-2 rounded"
            value={form.area}
            onChange={handleChange}
            required
          >
            <option value="">Select an Area</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Community Studies">Community Studies</option>
            <option value="Creative Technologies">Creative Technologies</option>
            <option value="Continuing Education">Continuing Education</option>
          </select>
        </div>

        {/* School */}
        <div>
          <label className="block font-semibold mb-1">School</label>
          <select
            name="school"
            className="w-full border p-2 rounded"
            value={form.school}
            onChange={handleChange}
            required
          >
            <option value="">Select a School</option>
            <option value="School of Technology">School of Technology</option>
            <option value="School of Business">School of Business</option>
            <option value="School of Health & Wellness">
              School of Health & Wellness
            </option>
            <option value="School of Community Studies">
              School of Community Studies
            </option>
            <option value="School of Creative Technologies">
              School of Creative Technologies
            </option>
            <option value="School of Global Access">School of Global Access</option>
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block font-semibold mb-1">Select the Color</label>
          <select
            name="color"
            className="w-full border p-2 rounded"
            value={form.color}
            onChange={handleChange}
            required
          >
            <option value="">Color</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="amber">Amber</option>
            <option value="red">Red</option>
            <option value="indigo">Indigo</option>
            <option value="cyan">Cyan</option>
            <option value="pink">Pink</option>
          </select>
        </div>

        {/* Icon */}
        <div>
          <label className="block font-semibold mb-1">
            Icon 
            <a
              href="https://fonts.google.com/icons?selected=Material+Symbols+Outlined"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 ml-2 underline hover:text-blue-800"
            >
              (search icons)
            </a>
          </label>

          <input
            type="text"
            name="icon"
            placeholder="Ex: cloud, code, security"
            className="w-full border p-2 rounded"
            value={form.icon}
            onChange={handleChange}
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            placeholder="Ex: 2 Years"
            className="w-full border p-2 rounded"
            value={form.duration}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded h-32"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Create Program"}
        </button>
      </form>
    </div>
  );
};

export default ProgramForm;

