import React, { useState, useEffect } from "react";

const AdmissionsForm = ({
  initialData,
  onSubmit,
  programs = [],
  lockProgram = false,
  lockedProgramName = "",
}) => {
  // Estado inicial (modo criação)
  const [form, setForm] = useState({
    program_id: "",
    title: "",
    requirements: "",
    transferability: "",
    language_proficiency: "",
    academic_upgrading: "",
  });

  // Carrega dados iniciais em modo edição
  useEffect(() => {
    if (initialData) {
      setForm({
        program_id: initialData.program_id || "",
        title: initialData.title || "",
        requirements: initialData.requirements || "",
        transferability: initialData.transferability || "",
        language_proficiency: initialData.language_proficiency || "",
        academic_upgrading: initialData.academic_upgrading || "",
      });
    }
  }, [initialData]);

  // Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envia formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    const output = {
      program_id: form.program_id,
      title: form.title,
      requirements: String(form.requirements || "")
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      transferability: form.transferability,
      language_proficiency: form.language_proficiency,
      academic_upgrading: form.academic_upgrading,
    };

    onSubmit(output);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Program */}
        <div>
          <label className="block font-semibold mb-1">Program</label>

          {lockProgram ? (
            // Modo edição: programa travado (somente leitura)
            <input
              type="text"
              className="w-full border rounded p-2 bg-gray-100 text-gray-600"
              value={lockedProgramName}
              disabled
            />
          ) : (
            // Modo criação: usuário escolhe o programa
            <select
              name="program_id"
              value={form.program_id}        // ✅ CORRETO
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select a program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.name}
                </option>
              ))}
            </select>
          )}
        </div>

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

        {/* Requirements */}
        <div>
          <label className="block font-semibold mb-1">
            Requirements (one per line)
          </label>
          <textarea
            name="requirements"
            className="w-full border p-2 rounded h-32"
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        {/* Transferability */}
        <div>
          <label className="block font-semibold mb-1">Transferability</label>
          <input
            type="text"
            name="transferability"
            className="w-full border p-2 rounded"
            value={form.transferability}
            onChange={handleChange}
          />
        </div>

        {/* Language Proficiency */}
        <div>
          <label className="block font-semibold mb-1">
            Language Proficiency
          </label>
          <input
            type="text"
            name="language_proficiency"
            className="w-full border p-2 rounded"
            value={form.language_proficiency}
            onChange={handleChange}
          />
        </div>

        {/* Academic Upgrading */}
        <div>
          <label className="block font-semibold mb-1">Academic Upgrading</label>
          <input
            type="text"
            name="academic_upgrading"
            className="w-full border p-2 rounded"
            value={form.academic_upgrading}
            onChange={handleChange}
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Create Admission"}
        </button>
      </form>
    </div>
  );
};

export default AdmissionsForm;
