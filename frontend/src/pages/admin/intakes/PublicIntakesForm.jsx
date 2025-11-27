import React, { useEffect, useState } from "react";

const PublicIntakesForm = ({ programs = [], initialData = null, onSubmit }) => {
  const [form, setForm] = useState({
    program_id: "",
    starts_in: "",
    domestic: "open",
    international: "open",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        program_id: initialData.program_id || "",
        starts_in: initialData.starts_in || "",
        domestic: initialData.domestic || "open",
        international: initialData.international || "open",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-2xl bg-white shadow p-8 rounded">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Public Intake" : "Add Public Intake"}
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Program */}
        <div>
          <label className="font-medium">Program</label>
          <select
            name="program_id"
            className="w-full border p-2 rounded"
            value={form.program_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a program...</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Starts In */}
        <div>
          <label className="font-medium">Starts In</label>
          <input
            type="text"
            name="starts_in"
            className="w-full border p-2 rounded"
            placeholder="Example: January 2026"
            value={form.starts_in}
            onChange={handleChange}
            required
          />
        </div>

        {/* Domestic */}
        <div>
          <label className="font-medium">Domestic Status</label>
          <select
            name="domestic"
            className="w-full border p-2 rounded"
            value={form.domestic}
            onChange={handleChange}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* International */}
        <div>
          <label className="font-medium">International Status</label>
          <select
            name="international"
            className="w-full border p-2 rounded"
            value={form.international}
            onChange={handleChange}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white p-2 rounded w-full" type="submit">
          {initialData ? "Save Changes" : "Create Public Intake"}
        </button>
      </form>
    </div>
  );
};

export default PublicIntakesForm;
