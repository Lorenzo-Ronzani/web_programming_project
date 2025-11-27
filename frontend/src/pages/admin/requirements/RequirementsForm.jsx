import React, { useEffect, useState } from "react";

const RequirementsForm = ({ programs = [], initialData = null, onSubmit }) => {
  const [form, setForm] = useState({
    program_id: "",
    laptop: "",
    software_tools: "",
    languages_taught: "",
  });

  // Preenche os campos no modo edição
  useEffect(() => {
    if (initialData) {
      setForm({
        program_id: initialData.program_id || "",
        laptop: initialData.laptop || "",
        software_tools: Array.isArray(initialData.software_tools)
          ? initialData.software_tools.join("\n")
          : "",
        languages_taught: Array.isArray(initialData.languages_taught)
          ? initialData.languages_taught.join("\n")
          : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      program_id: form.program_id,
      laptop: form.laptop,
      software_tools: form.software_tools
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      languages_taught: form.languages_taught
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    onSubmit(payload);
  };

  return (
    <div className="max-w-2xl bg-white shadow p-8 rounded">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Requirements" : "Add Requirements"}
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Program dropdown */}
        <div>
          <label className="font-medium">Program</label>
          <select
            name="program_id"
            className="w-full border p-2 rounded"
            value={form.program_id}
            onChange={handleChange}
            required
            disabled={Boolean(initialData)} // no EDIT não pode trocar programa
          >
            <option value="">Select a program...</option>

            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.short_title ? `(${p.short_title})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Laptop */}
        <div>
          <label className="font-medium">Laptop Requirements</label>
          <textarea
            name="laptop"
            className="w-full border p-2 rounded h-24"
            value={form.laptop}
            onChange={handleChange}
          />
        </div>

        {/* Software Tools */}
        <div>
          <label className="font-medium">Software Tools (one per line)</label>
          <textarea
            name="software_tools"
            className="w-full border p-2 rounded h-24"
            value={form.software_tools}
            onChange={handleChange}
          />
        </div>

        {/* Languages */}
        <div>
          <label className="font-medium">Languages Taught (one per line)</label>
          <textarea
            name="languages_taught"
            className="w-full border p-2 rounded h-24"
            value={form.languages_taught}
            onChange={handleChange}
          />
        </div>

        <button
          className="bg-blue-600 text-white p-2 rounded w-full"
          type="submit"
        >
          {initialData ? "Save Changes" : "Create Requirements"}
        </button>
      </form>
    </div>
  );
};

export default RequirementsForm;
