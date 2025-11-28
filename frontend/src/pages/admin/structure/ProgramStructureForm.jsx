// ------------------------------------------------------
// ProgramStructureForm.jsx
// Premium version with searchable Combobox for ADD mode,
// and disabled program field for EDIT mode.
// ------------------------------------------------------

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const ProgramStructureForm = ({ programs, initialData = null, onSubmit }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [query, setQuery] = useState("");
  const [terms, setTerms] = useState([]);

  const isEditMode = Boolean(initialData);

  // Load initial structure data when editing
  useEffect(() => {
    if (!initialData) return;

    const program = programs.find((p) => p.id === initialData.program_id);
    setSelectedProgram(program || null);

    const mappedTerms = initialData.terms?.map((t) => ({
      term_name: t.term_name || t.term || "",
      courses_text: Array.isArray(t.courses) ? t.courses.join("\n") : "",
    })) || [];

    setTerms(mappedTerms);
  }, [initialData, programs]);

  // Build and sort program list with displayName
  const formattedPrograms = useMemo(() => {
    return programs
      .map((p) => ({
        ...p,
        displayName:
          p.displayName ||
          `${p.title}${p.credential ? ` (${p.credential})` : ""}`,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [programs]);

  // Filter programs based on user search
  const filteredPrograms = useMemo(() => {
    if (!query) return formattedPrograms;

    return formattedPrograms.filter((p) =>
      p.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, formattedPrograms]);

  // Generate empty terms automatically in ADD mode
  useEffect(() => {
    if (isEditMode) return;
    if (!selectedProgram) return;

    const count = selectedProgram.program_length || 0;
    const autoTerms = Array.from({ length: count }, (_, i) => ({
      term_name: `Term ${i + 1}`,
      courses_text: "",
    }));

    setTerms(autoTerms);
  }, [selectedProgram, isEditMode]);

  const handleTermChange = (index, field, value) => {
    setTerms((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const programId = selectedProgram?.id;

    if (!programId) {
      alert("Please select a program.");
      return;
    }

    const payload = {
      program_id: programId,
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
        {isEditMode ? "Edit Program Structure" : "Add Program Structure"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Program field */}
        <div>
          <label className="font-medium block mb-1">Program</label>

          {isEditMode ? (
            // Read-only when editing
            <input
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-600"
              value={selectedProgram?.displayName || ""}
            />
          ) : (
            // Combobox premium when adding
            <Combobox value={selectedProgram} onChange={setSelectedProgram}>
              <div className="relative mt-1">
                {/* Input field */}
                <div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
                  <Combobox.Input
                    placeholder="Search for a program..."
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
                    displayValue={(p) => (p ? p.displayName : "")}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </Combobox.Button>
                </div>

                {/* Dropdown list */}
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {filteredPrograms.length === 0 ? (
                      <div className="cursor-default select-none px-4 py-2 text-gray-500">
                        No program found.
                      </div>
                    ) : (
                      filteredPrograms.map((p) => (
                        <Combobox.Option
                          key={p.id}
                          value={p}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-8 pr-4 ${
                              active ? "bg-blue-600 text-white" : ""
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {p.displayName}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-2 flex items-center">
                                  <CheckIcon className="h-5 w-5 text-blue-600" />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          )}
        </div>

        {/* Terms */}
        {terms.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Terms & Courses</h3>

            {terms.map((term, index) => (
              <div key={index} className="border rounded p-4 bg-gray-50 space-y-3">
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
                    Courses (one per line)
                  </label>
                  <textarea
                    className="w-full border p-2 rounded h-32"
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
          {isEditMode ? "Save Changes" : "Create Structure"}
        </button>
      </form>
    </div>
  );
};

export default ProgramStructureForm;
