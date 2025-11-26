import React, { useEffect, useState } from "react";

const AdmissionForm = ({ initialData = null, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    requirements: "",
    transferability: "",
    language_proficiency: "",
    academic_upgrading: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        requirements: initialData.requirements?.join("\n") || "",
        transferability: initialData.transferability || "",
        language_proficiency: initialData.language_proficiency || "",
        academic_upgrading: initialData.academic_upgrading || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      requirements: form.requirements
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      transferability: form.transferability,
      language_proficiency: form.language_proficiency,
      academic_upgrading: form.academic_upgrading,
    };

    onSubmit(payload);
  };

  return (
    <div className="max-w-2xl bg-white shadow p-8 rounded">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Admission" : "Add Admission"}
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* TITLE */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-2 rounded"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* REQUIREMENTS */}
        <div>
          <label className="block font-medium">
            Requirements (one per line)
          </label>
          <textarea
            name="requirements"
            className="w-full border p-2 rounded h-28"
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        {/* OPTIONAL */}
        <div>
          <label className="block font-medium">Transferability</label>
          <input
            name="transferability"
            className="w-full border p-2 rounded"
            value={form.transferability}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium">Language Proficiency</label>
          <input
            name="language_proficiency"
            className="w-full border p-2 rounded"
            value={form.language_proficiency}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium">Academic Upgrading</label>
          <input
            name="academic_upgrading"
            className="w-full border p-2 rounded"
            value={form.academic_upgrading}
            onChange={handleChange}
          />
        </div>

        <button
          className="bg-blue-600 text-white p-2 rounded w-full"
          type="submit"
        >
          {initialData ? "Save Changes" : "Create Admission"}
        </button>
      </form>
    </div>
  );
};

export default AdmissionForm;
