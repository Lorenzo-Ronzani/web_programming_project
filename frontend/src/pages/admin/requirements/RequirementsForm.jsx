import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const RequirementsForm = ({ programs, initialData = null, onSubmit }) => {
  const isEditMode = Boolean(initialData);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [query, setQuery] = useState("");

  const [laptop, setLaptop] = useState("");
  const [softwareToolsText, setSoftwareToolsText] = useState("");

  // ------------------------------------------------------
  // Load initial data (Edit mode)
  // ------------------------------------------------------
  useEffect(() => {
    if (!initialData) return;

    // Pre-select program
    const programFound = programs.find(
      (p) => p.id === initialData.program_id
    );
    setSelectedProgram(programFound || null);

    // Set laptop
    setLaptop(initialData.laptop || "");

    // Convert software tools array → textarea string
    if (Array.isArray(initialData.software_tools)) {
      setSoftwareToolsText(initialData.software_tools.join("\n"));
    }
  }, [initialData, programs]);

  // ------------------------------------------------------
  // Format and sort programs with displayName
  // ------------------------------------------------------
  const formattedPrograms = useMemo(() => {
    return programs
      .map((p) => ({
        ...p,
        displayName: `${p.title}${p.credential ? ` (${p.credential})` : ""}`,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [programs]);

  // Filter for Combobox search
  const filteredPrograms = useMemo(() => {
    if (!query) return formattedPrograms;
    return formattedPrograms.filter((p) =>
      p.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, formattedPrograms]);

  // ------------------------------------------------------
  // Submit handler
  // ------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const programId = selectedProgram?.id;
    if (!programId) {
      alert("Please select a program.");
      return;
    }

    const payload = {
      program_id: programId,
      laptop: laptop.trim(),
      software_tools: softwareToolsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    onSubmit(payload);
  };

  return (
    <div className="bg-white p-8 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Requirements" : "Add Requirements"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ------------------------------------------------------
            PROGRAM FIELD
        ------------------------------------------------------ */}
        <div>
          <label className="block font-medium mb-1">Program</label>

          {isEditMode ? (
            // Read-only program field
            <input
              disabled
              value={selectedProgram?.displayName || ""}
              className="w-full border rounded p-2 bg-gray-100 text-gray-600"
            />
          ) : (
            <Combobox value={selectedProgram} onChange={setSelectedProgram}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
                    placeholder="Search for a program..."
                    displayValue={(p) => (p ? p.displayName : "")}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </Combobox.Button>
                </div>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {filteredPrograms.length === 0 ? (
                      <div className="cursor-default select-none px-4 py-2 text-gray-500">
                        No programs found.
                      </div>
                    ) : (
                      filteredPrograms.map((p) => (
                        <Combobox.Option
                          key={p.id}
                          value={p}
                          className={({ active }) =>
                            `cursor-pointer select-none py-2 pl-8 pr-4 ${
                              active ? "bg-blue-600 text-white" : "text-gray-900"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {p.displayName}
                              </span>

                              {selected && (
                                <span className="absolute inset-y-0 left-2 flex items-center text-blue-600">
                                  <CheckIcon className="h-5 w-5" />
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

        {/* ------------------------------------------------------
            LAPTOP REQUIREMENTS
        ------------------------------------------------------ */}
        <div>
          <label className="block font-medium mb-1">
            Laptop Requirements
          </label>
          <textarea
            className="w-full border rounded p-2"
            rows={8}
            value={laptop}
            onChange={(e) => setLaptop(e.target.value)}
            placeholder="Describe the laptop requirements..."
          />
        </div>

        {/* ------------------------------------------------------
            SOFTWARE TOOLS
        ------------------------------------------------------ */}
        <div>
          <label className="block font-medium mb-1">Software Tools</label>
          <textarea
            className="w-full border rounded p-2"
            rows={5}
            value={softwareToolsText}
            onChange={(e) => setSoftwareToolsText(e.target.value)}
            placeholder="Add one tool per line..."
          />
        </div>

        {/* ------------------------------------------------------
            SUBMIT BUTTON
        ------------------------------------------------------ */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          {isEditMode ? "Save Changes" : "Create Requirement"}
        </button>
      </form>
    </div>
  );
};

export default RequirementsForm;
