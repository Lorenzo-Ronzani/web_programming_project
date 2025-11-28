// ------------------------------------------------------
// PublicIntakesForm.jsx - Clean + centered card layout
// Matching Admissions layout style
// ------------------------------------------------------
import React, { useState, useEffect } from "react";

const PublicIntakesForm = ({ programs, initialData = null, onSubmit }) => {
  const [form, setForm] = useState({
    program_id: "",
    starts_in: "",
    domestic_status: "not_offered",
    international_status: "not_offered",
    enable_status: "enabled",
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        program_id: initialData.program_id || "",
        starts_in: initialData.starts_in || "",
        domestic_status: initialData.domestic_status || "not_offered",
        international_status: initialData.international_status || "not_offered",
        enable_status: initialData.enable_status || "enabled",
      });
    }
  }, [initialData]);

  // Handle field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Program */}
        <div>
          <label className="block font-medium mb-1">Program</label>
          <select
            name="program_id"
            value={form.program_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a Program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Starts In */}
        <div>
          <label className="block font-medium mb-1">Starts In</label>
          <input
            type="text"
            name="starts_in"
            value={form.starts_in}
            onChange={handleChange}
            placeholder="Ex: January 2026"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Domestic Status */}
        <div>
          <label className="block font-medium mb-1">Domestic Status</label>
          <select
            name="domestic_status"
            value={form.domestic_status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="not_offered">Not Offered</option>
          </select>
        </div>

        {/* International Status */}
        <div>
          <label className="block font-medium mb-1">International Status</label>
          <select
            name="international_status"
            value={form.international_status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="not_offered">Not Offered</option>
          </select>
        </div>

        {/* Enable Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="enable_status"
            value={form.enable_status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {initialData ? "Save Changes" : "Create Public Intake"}
        </button>
      </form>
    </div>
  );
};

export default PublicIntakesForm;
