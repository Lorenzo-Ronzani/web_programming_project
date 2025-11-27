import React, { useEffect, useMemo, useState } from "react";

const ProgramStructureForm = ({ programs, initialData = null, onSubmit }) => {
  const [selectedProgramId, setSelectedProgramId] = useState(
    initialData?.program_id || ""
  );

  const [terms, setTerms] = useState(() => {
    if (initialData?.terms) {
      return initialData.terms.map((t) => ({
        term_name: t.term_name || "",
        courses_text: Array.isArray(t.courses) ? t.courses.join("\n") : "",
      }));
    }
    return [];
  });

  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === selectedProgramId),
    [programs, selectedProgramId]
  );

  // Quando selecionar um programa em modo ADD, gera termos automaticamente
  useEffect(() => {
    if (!selectedProgramId || initialData) return; // em edição, não mexe

    const termCount = selectedProgram?.number_of_terms || 4;

    const generatedTerms = Array.from({ length: termCount }, (_, i) => ({
      term_name: `Term ${i + 1}`,
      courses_text: "",
    }));

    setTerms(generatedTerms);
  }, [selectedProgramId, selectedProgram, initialData]);

  const handleTermChange = (index, field, value) => {
    setTerms((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProgramId) {
      alert("Please select a program.");
      return;
    }

    const payload = {
      program_id: selectedProgramId,
      terms: terms.map((t) => ({
        term_name: t.term_name,
        courses: t.courses_text
          .split("\n")
          .map((c) => c.trim())
          .filter(Boolean),
      })),
    };

    onSubmit(payload);
  };

  return (
    <div className="max-w-3xl bg-white shadow p-8 rounded">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Program Structure" : "Add Program Structure"}
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Program select */}
        <div>
          <label className="font-medium block mb-1">Program</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            disabled={Boolean(initialData)} // em edição, não muda o program
          >
            <option value="">Select a program...</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.short_title ? `(${p.short_title})` : ""}
              </option>
            ))}
          </select>
          {selectedProgram && (
            <p className="mt-1 text-sm text-gray-500">
              Terms configured in Program:{" "}
              <strong>{selectedProgram.number_of_terms || 4}</strong>
            </p>
          )}
        </div>

        {/* Terms */}
        {terms.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Terms & Courses</h3>

            {terms.map((term, index) => (
              <div
                key={index}
                className="border rounded p-4 bg-gray-50 space-y-3"
              >
                <div>
                  <label className="font-medium block mb-1">
                    Term name #{index + 1}
                  </label>
                  <input
                    className="w-full border p-2 rounded"
                    value={term.term_name}
                    onChange={(e) =>
                      handleTermChange(index, "term_name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="font-medium block mb-1">
                    Courses (one per line, use course code or title)
                  </label>
                  <textarea
                    className="w-full border p-2 rounded h-24"
                    value={term.courses_text}
                    onChange={(e) =>
                      handleTermChange(index, "courses_text", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Create Structure"}
        </button>
      </form>
    </div>
  );
};

export default ProgramStructureForm;
