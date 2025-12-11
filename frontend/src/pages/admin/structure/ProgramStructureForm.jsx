import React, { useEffect, useMemo, useState } from "react";
import { Combobox } from "@headlessui/react";

const ProgramStructureForm = ({
  programs,
  courses,
  initialData = null,
  onSubmit,
}) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programQuery, setProgramQuery] = useState("");
  const [terms, setTerms] = useState([]);

  const isEditMode = Boolean(initialData);

  // Helper to build terms from existing data (Edit mode)
  const buildTermsFromInitialData = (data, courseList) => {
    if (!data || !Array.isArray(data.terms)) return [];

    return data.terms.map((t, index) => {
      const termName = t.term_name || t.term || `Term ${index + 1}`;

      let selectedCourseIds = [];

      // Support both legacy string array and new object array
      if (Array.isArray(t.courses) && t.courses.length > 0) {
        const firstItem = t.courses[0];

        if (typeof firstItem === "string") {
          // Legacy format: "CODE-Title"
          selectedCourseIds = t.courses
            .map((str) => {
              const code = str.split("-")[0].trim();
              const found = courseList.find((c) => c.code === code);
              return found ? found.id : null;
            })
            .filter(Boolean);
        } else if (typeof firstItem === "object") {
          // New format with course_id
          selectedCourseIds = t.courses
            .map((obj) => obj.course_id)
            .filter(Boolean);
        }
      }

      return {
        term_name: termName,
        selectedCourseIds,
        search: "",
      };
    });
  };

  // Load initial data in Edit mode
  useEffect(() => {
    if (!initialData) return;

    const program = programs.find((p) => p.id === initialData.program_id);
    setSelectedProgram(program || null);

    const mappedTerms = buildTermsFromInitialData(initialData, courses);
    setTerms(mappedTerms);
  }, [initialData, programs, courses]);

  // Build formatted program list with displayName
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

  // Filter programs by combobox search query
  const filteredPrograms = useMemo(() => {
    if (!programQuery) return formattedPrograms;
    return formattedPrograms.filter((p) =>
      p.displayName.toLowerCase().includes(programQuery.toLowerCase())
    );
  }, [programQuery, formattedPrograms]);

  // Generate terms automatically in ADD mode based on program_length
  useEffect(() => {
    if (isEditMode) return;
    if (!selectedProgram) return;

    const count = selectedProgram.program_length || 0;
    const autoTerms = Array.from({ length: count }, (_, i) => ({
      term_name: `Term ${i + 1}`,
      selectedCourseIds: [],
      search: "",
    }));

    setTerms(autoTerms);
  }, [selectedProgram, isEditMode]);

  // Update a field in a specific term
  const handleTermFieldChange = (index, field, value) => {
    setTerms((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  // Add a course to a term
  const handleAddCourseToTerm = (termIndex, courseId) => {
    setTerms((prev) =>
      prev.map((t, i) => {
        if (i !== termIndex) return t;
        if (t.selectedCourseIds.includes(courseId)) return t;

        return {
          ...t,
          selectedCourseIds: [...t.selectedCourseIds, courseId],
        };
      })
    );
  };

  // Remove a course from a term
  const handleRemoveCourseFromTerm = (termIndex, courseId) => {
    setTerms((prev) =>
      prev.map((t, i) =>
        i === termIndex
          ? {
              ...t,
              selectedCourseIds: t.selectedCourseIds.filter(
                (id) => id !== courseId
              ),
            }
          : t
      )
    );
  };

  // Build the payload and call parent onSubmit
  const handleSubmit = (e) => {
    e.preventDefault();

    const programId = selectedProgram?.id;

    if (!programId) {
      alert("Please select a program.");
      return;
    }

    // Convert term state to API payload
    const payload = {
      program_id: programId,
      terms: terms.map((t) => {
        const selectedCourses = t.selectedCourseIds.map((courseId, index) => {
          const course = courses.find((c) => c.id === courseId);
          return {
            course_id: courseId,
            course_code: course?.code || "",
            course_title: course?.title || "",
            order: index + 1,
          };
        });

        return {
          term_name: t.term_name,
          courses: selectedCourses,
        };
      }),
    };

    onSubmit(payload);
  };

  // Helper to get course info by id
  const getCourseById = (id) => courses.find((c) => c.id === id);

  return (
    <div className="max-w-4xl bg-white shadow p-8 rounded">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode ? "Edit Program Structure" : "Add Program Structure"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Program selection */}
        <div>
          <label className="font-medium block mb-1">Program</label>

          {isEditMode ? (
            // Read-only in edit mode
            <input
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-600"
              value={selectedProgram?.displayName || ""}
            />
          ) : (
            // Combobox with search in add mode
            <Combobox value={selectedProgram} onChange={setSelectedProgram}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded border bg-white text-left">
                  <Combobox.Input
                    placeholder="Search for a program..."
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
                    displayValue={(p) => (p ? p.displayName : "")}
                    onChange={(e) => setProgramQuery(e.target.value)}
                  />
                </div>

                {filteredPrograms.length > 0 && (
                  <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                    {filteredPrograms.map((p) => (
                      <Combobox.Option
                        key={p.id}
                        value={p}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 pl-3 pr-3 ${
                            active ? "bg-blue-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {p.displayName}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}

                {filteredPrograms.length === 0 && programQuery && (
                  <div className="absolute z-20 mt-1 w-full rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 px-3 py-2 text-sm text-gray-500">
                    No program found.
                  </div>
                )}
              </div>
            </Combobox>
          )}
        </div>

        {/* Terms and course selection */}
        {terms.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Terms and Courses</h3>

            {terms.map((term, termIndex) => {
              const search = term.search || "";

              // Filter available courses based on search text
              const filteredCourses = courses.filter((c) => {
                const needle = search.toLowerCase();
                return (
                  c.code?.toLowerCase().includes(needle) ||
                  c.title?.toLowerCase().includes(needle)
                );
              });

              return (
                <div
                  key={termIndex}
                  className="border rounded p-4 bg-gray-50 space-y-3"
                >
                  {/* Term name */}
                  <div>
                    <label className="font-medium block mb-1">
                      Term name #{termIndex + 1}
                    </label>
                    <input
                      className="w-full border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={term.term_name}
                      disabled
                      readOnly
                      onChange={(e) =>
                        handleTermFieldChange(
                          termIndex,
                          "term_name",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Selected courses as tags */}
                  <div>
                    <label className="font-medium block mb-1">
                      Selected courses
                    </label>

                    {term.selectedCourseIds.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No courses selected yet.
                      </p>
                    )}

                    {term.selectedCourseIds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {term.selectedCourseIds.map((courseId) => {
                          const c = getCourseById(courseId);
                          if (!c) return null;

                          return (
                            <span
                              key={courseId}
                              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                            >
                              {c.code} - {c.title}
                              <button
                                type="button"
                                className="ml-2 text-blue-700 hover:text-blue-900"
                                onClick={() =>
                                  handleRemoveCourseFromTerm(
                                    termIndex,
                                    courseId
                                  )
                                }
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Search and course list */}
                  <div>
                    <label className="font-medium block mb-1">
                      Search and add courses
                    </label>
                    <input
                      className="w-full border p-2 rounded mb-2 text-sm"
                      placeholder="Type part of the code or title..."
                      value={search}
                      onChange={(e) =>
                        handleTermFieldChange(
                          termIndex,
                          "search",
                          e.target.value
                        )
                      }
                    />

                    <div className="max-h-40 overflow-y-auto border rounded bg-white text-sm">
                      {filteredCourses.length === 0 && (
                        <p className="px-3 py-2 text-gray-500">
                          No courses match this search.
                        </p>
                      )}

                      {filteredCourses.map((c) => {
                        const alreadySelected =
                          term.selectedCourseIds.includes(c.id);

                        return (
                          <button
                            key={c.id}
                            type="button"
                            className={`w-full text-left px-3 py-2 border-b last:border-b-0 ${
                              alreadySelected
                                ? "bg-blue-50 text-blue-800"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() =>
                              handleAddCourseToTerm(termIndex, c.id)
                            }
                            disabled={alreadySelected}
                          >
                            <span className="font-medium">{c.code}</span>{" "}
                            {" - "}
                            <span>{c.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
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
