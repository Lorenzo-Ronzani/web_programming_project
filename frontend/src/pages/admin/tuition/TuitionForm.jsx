import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const TuitionForm = ({ programs = [], initialData = null, onSubmit }) => {
  const [programId, setProgramId] = useState(initialData?.program_id || "");
  const [terms, setTerms] = useState([]); // ["Term 1", "Term 2", ...]
  const [domestic, setDomestic] = useState([]);
  const [international, setInternational] = useState([]);
  const [activeTab, setActiveTab] = useState("domestic");
  const [loadingStructure, setLoadingStructure] = useState(false);

  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === programId),
    [programId, programs]
  );

  // Carrega termos a partir do Program Structure ao selecionar programa (modo ADD)
  useEffect(() => {
    if (!programId || initialData) return;

    const loadStructure = async () => {
      setLoadingStructure(true);
      try {
        const q = query(
          collection(db, "program_structure"),
          where("program_id", "==", programId)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const doc = snap.docs[0].data();
          const termNames =
            doc.terms?.map((t) => t.term_name || "").filter(Boolean) || [];

          setTerms(termNames);

          setDomestic(
            termNames.map(() => ({
              tuition_fee: "",
              additional_fees: "",
            }))
          );
          setInternational(
            termNames.map(() => ({
              tuition_fee: "",
              additional_fees: "",
            }))
          );
        } else {
          setTerms([]);
          setDomestic([]);
          setInternational([]);
        }
      } catch (err) {
        console.error("Error loading program structure:", err);
      } finally {
        setLoadingStructure(false);
      }
    };

    loadStructure();
  }, [programId, initialData]);

  // Preenche dados no modo edição
  useEffect(() => {
    if (!initialData) return;

    setProgramId(initialData.program_id || "");

    const domesticTerms = initialData.domestic?.terms || [];
    const internationalTerms = initialData.international?.terms || [];

    const termNames =
      domesticTerms.length > 0
        ? domesticTerms.map((t) => t.term)
        : internationalTerms.map((t) => t.term);

    setTerms(termNames);

    setDomestic(
      termNames.map((name, idx) => ({
        tuition_fee: domesticTerms[idx]?.tuition_fee ?? "",
        additional_fees: domesticTerms[idx]?.additional_fees ?? "",
      }))
    );

    setInternational(
      termNames.map((name, idx) => ({
        tuition_fee: internationalTerms[idx]?.tuition_fee ?? "",
        additional_fees: internationalTerms[idx]?.additional_fees ?? "",
      }))
    );
  }, [initialData]);

  const handleChange = (type, index, field, value) => {
    if (type === "domestic") {
      setDomestic((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, [field]: value } : { ...t }
        )
      );
    } else {
      setInternational((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, [field]: value } : { ...t }
        )
      );
    }
  };

  const calcTotal = (row) => {
    const tuition = Number(row.tuition_fee || 0);
    const add = Number(row.additional_fees || 0);
    return tuition + add;
  };

  const calcEstimatedTotal = (rows) =>
    rows.reduce((sum, r) => sum + calcTotal(r), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!programId) {
      alert("Please select a program.");
      return;
    }

    const domesticTerms = terms.map((name, idx) => {
      const row = domestic[idx] || {};
      const total = calcTotal(row);
      return {
        term: name,
        tuition_fee: Number(row.tuition_fee || 0),
        additional_fees: Number(row.additional_fees || 0),
        total,
      };
    });

    const internationalTerms = terms.map((name, idx) => {
      const row = international[idx] || {};
      const total = calcTotal(row);
      return {
        term: name,
        tuition_fee: Number(row.tuition_fee || 0),
        additional_fees: Number(row.additional_fees || 0),
        total,
      };
    });

    const payload = {
      program_id: programId,
      domestic: {
        terms: domesticTerms,
        estimated_total: calcEstimatedTotal(domestic),
      },
      international: {
        terms: internationalTerms,
        estimated_total: calcEstimatedTotal(international),
      },
    };

    onSubmit(payload);
  };

  const renderTable = (rows, typeLabel) => {
    const estimated = calcEstimatedTotal(rows);

    return (
      <div className="mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-blue-50 text-gray-700">
              <th className="py-2 px-3">Term</th>
              <th className="py-2 px-3">Tuition fees</th>
              <th className="py-2 px-3">Additional fees</th>
              <th className="py-2 px-3">Total fees*</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((termName, idx) => {
              const row = rows[idx] || { tuition_fee: "", additional_fees: "" };
              const total = calcTotal(row);

              return (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">{termName}</td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      className="w-full border rounded p-1"
                      value={row.tuition_fee}
                      onChange={(e) =>
                        handleChange(
                          typeLabel,
                          idx,
                          "tuition_fee",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      className="w-full border rounded p-1"
                      value={row.additional_fees}
                      onChange={(e) =>
                        handleChange(
                          typeLabel,
                          idx,
                          "additional_fees",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="py-2 px-3 font-semibold">
                    ${total.toLocaleString("en-CA")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 text-right font-semibold">
          Estimated total tuition:{" "}
          <span className="text-blue-700">
            ${estimated.toLocaleString("en-CA")}
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          *All tuition and fees are subject to change. Program tuitions are
          estimates only.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white shadow p-8 rounded max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6">
        {initialData ? "Edit Tuition" : "Add Tuition"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Program */}
        <div>
          <label className="font-medium block mb-1">Program</label>
          <select
            className="w-full border rounded p-2"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            required
            disabled={Boolean(initialData)} // não troca prog no edit
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
              Terms defined in Program Structure:{" "}
              <strong>{terms.length}</strong>
            </p>
          )}
        </div>

        {loadingStructure && <p>Loading program structure...</p>}

        {/* Tabs: Domestic / International */}
        {terms.length > 0 && !loadingStructure && (
          <>
            <div className="flex border-b mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("domestic")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "domestic"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Domestic Students
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("international")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "international"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                International Students
              </button>
            </div>

            {activeTab === "domestic"
              ? renderTable(domestic, "domestic")
              : renderTable(international, "international")}
          </>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
        >
          {initialData ? "Save Changes" : "Create Tuition"}
        </button>
      </form>
    </div>
  );
};

export default TuitionForm;
