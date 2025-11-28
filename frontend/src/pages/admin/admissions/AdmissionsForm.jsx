// ------------------------------------------------------
// AdmissionsForm.jsx
// Handles Add + Edit for Admissions.
// Requirements stored as array in DB but edited as textarea.
// ------------------------------------------------------

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const AdmissionsForm = ({ programs, initialData = null, onSubmit }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    title: "",
    requirements: "",
    transferability: "",
    language_proficiency: "",
    academic_upgrading: "",
  });

  const isEditMode = Boolean(initialData);

  // Pre-fill form on Edit Mode
  useEffect(() => {
    if (!initialData || programs.length === 0) return;

    // Find selected program
    const found = programs.find((p) => p.id === initialData.program_id);
    setSelectedProgram(found || null);

    // Convert requirements array into textarea
    const requirementsText = Array.isArray(initialData.requirements)
      ? initialData.requirements.join("\n")
      : "";

    setForm({
      title: initialData.title || "",
      requirements: requirementsText,
      transferability: initialData.transferability || "",
      language_proficiency: initialData.language_proficiency || "",
      academic_upgrading: initialData.academic_upgrading || "",
    });
  }, [initialData, programs]);

  // Handle simple fields
  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Build program list with displayName
  const formattedPrograms = useMemo(() => {
    return programs
      .map((p) => ({
        ...p,
        displayName: `${p.title}${
          p.credential ? ` (${p.credential})` : ""
        }`,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [programs]);

  // Filter for combobox search
  const filteredPrograms = useMemo(() => {
    if (!query) return formattedPrograms;
    return formattedPrograms.filter((p) =>
      p.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, formattedPrograms]);

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const programId = selectedProgram?.id;

    if (!programId) {
      alert("Please select a program.");
      return;
    }

    const payload = {
      program_id: programId,
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
    <div className="bg-white p-8 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Admission" : "Add Admission"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Program */}
        <div>
          <label className="block font-medium mb-1">Program</label>

          {isEditMode ? (
            <input
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-600"
              value={selectedProgram?.displayName || ""}
            />
          ) : (
            <Combobox value={selectedProgram} onChange={setSelectedProgram}>
              <div className="relative mt-1">
                {/* Input */}
                <div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm focus:ring-0"
                    placeholder="Search for a program..."
                    displayValue={(p) => (p ? p.displayName : "")}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </Combobox.Button>
                </div>

                {/* Dropdown */}
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    {filteredPrograms.length === 0 ? (
                      <div className="cursor-default px-4 py-2 text-gray-500">
                        No program found.
                      </div>
                    ) : (
                      filteredPrograms.map((p) => (
                        <Combobox.Option
                          key={p.id}
                          value={p}
                          className={({ active }) =>
                            `cursor-pointer select-none py-2 pl-8 pr-4 ${
                              active ? "bg-blue-600 text-white" : ""
                            }`
                          }
                        >
                          {({ selected }) => (
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {p.displayName}
                            </span>
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

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleField}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block font-medium mb-1">Requirements</label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleField}
            className="w-full border p-2 rounded h-32"
          />
        </div>

        {/* Transferability */}
        <div>
          <label className="block font-medium mb-1">Transferability</label>
          <textarea
            name="transferability"
            value={form.transferability}
            onChange={handleField}
            className="w-full border p-2 rounded h-24"
          />
        </div>

        {/* Language proficiency */}
        <div>
          <label className="block font-medium mb-1">
            Language Proficiency
          </label>
          <textarea
            name="language_proficiency"
            value={form.language_proficiency}
            onChange={handleField}
            className="w-full border p-2 rounded h-24"
          />
        </div>

        {/* Academic Upgrading */}
        <div>
          <label className="block font-medium mb-1">Academic Upgrading</label>
          <textarea
            name="academic_upgrading"
            value={form.academic_upgrading}
            onChange={handleField}
            className="w-full border p-2 rounded h-24"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          {isEditMode ? "Save Changes" : "Create Admission"}
        </button>
      </form>
    </div>
  );
};

export default AdmissionsForm;
