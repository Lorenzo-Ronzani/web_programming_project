// ------------------------------------------------------
// TuitionSection.jsx
// Public tuition display for Domestic & International.
// Automatically normalizes data coming from Firestore,
// supporting both correct and incorrect formats.
// ------------------------------------------------------

import React, { useState } from "react";

const TuitionSection = ({ tuition }) => {
  const [activeTab, setActiveTab] = useState("domestic");

  if (!tuition) {
    return (
      <p className="text-gray-600">
        Tuition information is not available for this program.
      </p>
    );
  }

  // ------------------------------------------------------
  // Normalize term arrays
  // Firestore can store incorrectly as:
  // domestic: { 0: {...}, 1: {...}, estimated_total: 10000 }
  // Or correctly as:
  // domestic: { terms: [...], estimated_total: 10000 }
  // ------------------------------------------------------
  const normalizeTerms = (group) => {
    if (!group) return [];

    // Case 1: Correct format
    if (Array.isArray(group.terms)) {
      return group.terms;
    }

    // Case 2: Incorrect format – convert object values to array
    return Object.values(group).filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.term_name &&
        item.tuition_fee !== undefined
    );
  };

  const domesticTerms = normalizeTerms(tuition.domestic);
  const internationalTerms = normalizeTerms(tuition.international);

  // ------------------------------------------------------
  // Fee calculation helpers
  // ------------------------------------------------------
  const calcTotal = (fee, extra) => {
    return Number(fee || 0) + Number(extra || 0);
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    });

  const selectedTerms =
    activeTab === "domestic" ? domesticTerms : internationalTerms;

  const estimatedTotal =
    activeTab === "domestic"
      ? tuition.domestic?.estimated_total || 0
      : tuition.international?.estimated_total || 0;

  // ------------------------------------------------------
  // Render UI
  // ------------------------------------------------------
  return (
    <div className="rounded-xl bg-blue-50 p-6 border border-blue-100">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("domestic")}
          className={`px-4 py-2 rounded border ${
            activeTab === "domestic"
              ? "bg-white shadow font-semibold border-blue-300"
              : "bg-blue-100 border-transparent"
          }`}
        >
          Domestic Students
        </button>

        <button
          onClick={() => setActiveTab("international")}
          className={`px-4 py-2 rounded border ${
            activeTab === "international"
              ? "bg-white shadow font-semibold border-blue-300"
              : "bg-blue-100 border-transparent"
          }`}
        >
          International Students
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-200 text-blue-900 font-semibold">
              <th className="p-2 text-left">Term</th>
              <th className="p-2 text-left">Tuition fees</th>
              <th className="p-2 text-left">Additional fees</th>
              <th className="p-2 text-left">Total fees</th>
            </tr>
          </thead>

          <tbody>
            {selectedTerms.map((t, index) => (
              <tr key={index} className="border-b border-blue-100">
                <td className="p-2">{t.term_name}</td>
                <td className="p-2">{formatMoney(t.tuition_fee)}</td>
                <td className="p-2">{formatMoney(t.additional_fees)}</td>
                <td className="p-2">
                  {formatMoney(calcTotal(t.tuition_fee, t.additional_fees))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <p className="text-right text-lg font-semibold text-blue-900 mt-4">
        Estimated total tuition: {formatMoney(estimatedTotal)}
      </p>

      <p className="text-xs text-gray-600 mt-4">
        *All tuition and fees are subject to change. Program tuitions are
        estimates only. Your actual tuition and fees are calculated on course
        registrations.
      </p>
    </div>
  );
};

export default TuitionSection;
