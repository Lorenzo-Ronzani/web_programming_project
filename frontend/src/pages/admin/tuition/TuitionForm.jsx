// ------------------------------------------------------
// TuitionForm.jsx
// Handles Add + Edit tuition data.
// In Add mode: program is searchable Combobox.
// In Edit mode: program is shown in read-only format.
// Tuition is divided into Domestic and International tables.
// ------------------------------------------------------

import React, {
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";

const TuitionForm = ({ programs, initialData = null, onSubmit }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [queryText, setQueryText] = useState("");

  const [domesticTerms, setDomesticTerms] = useState([]);
  const [internationalTerms, setInternationalTerms] = useState([]);
  const [activeTab, setActiveTab] = useState("domestic");
  const isEditMode = Boolean(initialData);

  // ------------------------------------------------------
  // Load initial data from Edit Mode
  // ------------------------------------------------------
  useEffect(() => {
    if (!initialData || programs.length === 0) return;

    // Pre-select program
    const programFound = programs.find(
      (p) => p.id === initialData.program_id
    );
    setSelectedProgram(programFound || null);

    // Setup terms
    setDomesticTerms(initialData.domestic || []);
    setInternationalTerms(initialData.international || []);
  }, [initialData, programs]);

  // ------------------------------------------------------
  // Generate Display Names for Programs
  // ------------------------------------------------------
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

  // ------------------------------------------------------
  // Combobox Search Filter
  // ------------------------------------------------------
  const filteredPrograms = useMemo(() => {
    if (!queryText) return formattedPrograms;
    return formattedPrograms.filter((p) =>
      p.displayName.toLowerCase().includes(queryText.toLowerCase())
    );
  }, [queryText, formattedPrograms]);

  // ------------------------------------------------------
  // Handle Changes in Tuition Fields
  // ------------------------------------------------------
  const handleTermChange = (index, field, value, isDomestic = true) => {
    if (isDomestic) {
      setDomesticTerms((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, [field]: value } : t
        )
      );
    } else {
      setInternationalTerms((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, [field]: value } : t
        )
      );
    }
  };

  // ------------------------------------------------------
  // Fee Calculations
  // ------------------------------------------------------
  const calcTotal = (fee, add) => {
    const f = parseFloat(fee || 0);
    const a = parseFloat(add || 0);
    return f + a;
  };

  const calcEstimatedTotal = (list) =>
    list.reduce(
      (sum, t) => sum + calcTotal(t.tuition_fee, t.additional_fees),
      0
    );

  // ------------------------------------------------------
  // Submit Handler
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
      domestic: domesticTerms,
      international: internationalTerms,
    };

    onSubmit(payload);
  };

  return (
    <div className="bg-white p-8 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Tuition" : "Add Tuition"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ------------------------------------------------------
            PROGRAM FIELD
        ------------------------------------------------------ */}
        <div>
          <label className="font-medium block mb-1">Program</label>

          {isEditMode ? (
            // Read-only field in Edit Mode
            <input
              disabled
              value={selectedProgram?.displayName || ""}
              className="w-full border rounded p-2 bg-gray-100 text-gray-600"
            />
          ) : (
            // Premium Combobox in Add Mode
            <Combobox
              value={selectedProgram}
              onChange={setSelectedProgram}
            >
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
                    placeholder="Search program..."
                    displayValue={(p) =>
                      p ? p.displayName : ""
                    }
                    onChange={(e) => setQueryText(e.target.value)}
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
                        No program found.
                      </div>
                    ) : (
                      filteredPrograms.map((p) => (
                        <Combobox.Option
                          key={p.id}
                          value={p}
                          className={({ active }) =>
                            `cursor-pointer select-none py-2 pl-8 pr-4 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected
                                    ? "font-medium"
                                    : "font-normal"
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

          {selectedProgram && (
            <p className="text-sm text-gray-500 mt-1">
              Terms found:{" "}
              <strong>{selectedProgram.program_length}</strong>
            </p>
          )}
        </div>

        {/* ------------------------------------------------------
            TABS FOR DOMESTIC / INTERNATIONAL
        ------------------------------------------------------ */}
        <div className="flex space-x-6 border-b pb-1">
          <button
            type="button"
            className={`pb-2 ${
              activeTab === "domestic"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("domestic")}
          >
            Domestic Students
          </button>

          <button
            type="button"
            className={`pb-2 ${
              activeTab === "international"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("international")}
          >
            International Students
          </button>
        </div>

        {/* ------------------------------------------------------
            DOMESTIC TERMS TABLE
        ------------------------------------------------------ */}
        {activeTab === "domestic" && (
          <div>
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Term</th>
                  <th className="p-2">Tuition fees</th>
                  <th className="p-2">Additional fees</th>
                  <th className="p-2">Total fees*</th>
                </tr>
              </thead>
              <tbody>
                {domesticTerms.map((t, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{t.term_name}</td>

                    <td className="p-2">
                      <input
                        className="w-full border rounded p-1"
                        value={t.tuition_fee}
                        onChange={(e) =>
                          handleTermChange(
                            index,
                            "tuition_fee",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </td>

                    <td className="p-2">
                      <input
                        className="w-full border rounded p-1"
                        value={t.additional_fees}
                        onChange={(e) =>
                          handleTermChange(
                            index,
                            "additional_fees",
                            e.target.value,
                            true
                          )
                        }
                      />
                    </td>

                    <td className="p-2 font-medium">
                      $
                      {calcTotal(
                        t.tuition_fee,
                        t.additional_fees
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-right font-semibold">
              Estimated total tuition:{" "}
              <span className="text-blue-600">
                $
                {calcEstimatedTotal(domesticTerms).toLocaleString()}
              </span>
            </p>
          </div>
        )}

        {/* ------------------------------------------------------
            INTERNATIONAL TERMS TABLE
        ------------------------------------------------------ */}
        {activeTab === "international" && (
          <div>
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Term</th>
                  <th className="p-2">Tuition fees</th>
                  <th className="p-2">Additional fees</th>
                  <th className="p-2">Total fees*</th>
                </tr>
              </thead>
              <tbody>
                {internationalTerms.map((t, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{t.term_name}</td>

                    <td className="p-2">
                      <input
                        className="w-full border rounded p-1"
                        value={t.tuition_fee}
                        onChange={(e) =>
                          handleTermChange(
                            index,
                            "tuition_fee",
                            e.target.value,
                            false
                          )
                        }
                      />
                    </td>

                    <td className="p-2">
                      <input
                        className="w-full border rounded p-1"
                        value={t.additional_fees}
                        onChange={(e) =>
                          handleTermChange(
                            index,
                            "additional_fees",
                            e.target.value,
                            false
                          )
                        }
                      />
                    </td>

                    <td className="p-2 font-medium">
                      $
                      {calcTotal(
                        t.tuition_fee,
                        t.additional_fees
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-right font-semibold">
              Estimated total tuition:{" "}
              <span className="text-blue-600">
                $
                {calcEstimatedTotal(
                  internationalTerms
                ).toLocaleString()}
              </span>
            </p>
          </div>
        )}

        {/* ------------------------------------------------------
            SUBMIT BUTTON
        ------------------------------------------------------ */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          {isEditMode ? "Save Changes" : "Create Tuition"}
        </button>
      </form>
    </div>
  );
};

export default TuitionForm;
