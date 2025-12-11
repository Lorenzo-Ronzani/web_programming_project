import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const PublicIntakesForm = ({ programs, initialData = null, onSubmit }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [query, setQuery] = useState("");

  // Local form state
  const [form, setForm] = useState({
    program_id: "",
    starts_in: "",
    domestic_status: "not_offered",
    international_status: "not_offered",
    enable_status: "enabled",
  });

  // Populate form when editing
  useEffect(() => {
    if (!initialData) return;

    // Find the selected program based on program_id
    const found = programs.find((p) => p.id === initialData.program_id);
    setSelectedProgram(found || null);

    // Pre-fill form values
    setForm({
      program_id: initialData.program_id,
      starts_in: initialData.starts_in || "",
      domestic_status: initialData.domestic_status || "not_offered",
      international_status: initialData.international_status || "not_offered",
      enable_status: initialData.enable_status || "enabled",
    });
  }, [initialData, programs]);

  // Handle simple typed fields
  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Format and sort programs list with displayName
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

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      program_id: selectedProgram?.id,
      starts_in: form.starts_in,
      domestic_status: form.domestic_status,
      international_status: form.international_status,
      enable_status: form.enable_status,
    };

    onSubmit(payload);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border shadow">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Program Field */}
        <div>
          <label className="block font-medium mb-1">Program</label>

          {initialData ? (
            // Read-only program display when editing
            <input
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-600"
              value={
                selectedProgram?.displayName ||
                `${selectedProgram?.title || ""}${
                  selectedProgram?.credential
                    ? ` (${selectedProgram.credential})`
                    : ""
                }`
              }
            />
          ) : (
            // Searchable combobox when adding a new intake
            <Combobox value={selectedProgram} onChange={setSelectedProgram}>
              <div className="relative mt-1">
                {/* Combobox input */}
                <div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
                    placeholder="Search program..."
                    displayValue={(p) => (p ? p.displayName : "")}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>

                {/* Combobox dropdown list */}
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {p.displayName}
                              </span>

                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-2 flex items-center ${
                                    active ? "text-white" : "text-blue-600"
                                  }`}
                                >
                                  <CheckIcon className="h-5 w-5" />
                                </span>
                              ) : null}
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

        {/* Starts In */}
        <div>
          <label className="block font-medium mb-1">Starts In</label>
          <input
            type="text"
            name="starts_in"
            value={form.starts_in}
            onChange={handleField}
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
            className="w-full border p-2 rounded"
            value={form.domestic_status}
            onChange={handleField}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="not_offered">Not Offered</option>
          </select>
        </div>

        {/* International Status */}
        <div>
          <label className="block font-medium mb-1">
            International Status
          </label>
          <select
            name="international_status"
            className="w-full border p-2 rounded"
            value={form.international_status}
            onChange={handleField}
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
            className="w-full border p-2 rounded"
            value={form.enable_status}
            onChange={handleField}
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Submit button */}
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
