// ---------------------------------------------------------
// TuitionSection.jsx (final version - Bow Valley style)
// ---------------------------------------------------------

import { useState } from "react";

const TuitionSection = ({ tuition }) => {
  const [activeTab, setActiveTab] = useState("domestic");

  if (!tuition) {
    return (
      <p className="text-gray-600">
        Tuition information is not available for this program yet.
      </p>
    );
  }

  const domestic = tuition.domestic || {};
  const international = tuition.international || {};

  const formatMoney = (num) =>
    num ? `$${num.toLocaleString("en-US")}` : "—";

  const renderTable = (data) => {
    const terms = data.terms || [];

    return (
      <div className="bg-blue-50 rounded-xl p-8 shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="pb-2">Term</th>
              <th className="pb-2">Tuition fees</th>
              <th className="pb-2">Additional fees</th>
              <th className="pb-2">Total fees</th>
            </tr>
          </thead>

          <tbody>
            {terms.map((t, idx) => (
              <tr key={idx} className="border-b text-gray-800">
                <td className="py-3">{t.term}</td>
                <td className="py-3">{formatMoney(t.tuition_fee)}</td>
                <td className="py-3">{formatMoney(t.additional_fees)}</td>
                <td className="py-3 font-semibold">{formatMoney(t.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-6">
          <p className="text-gray-900 font-semibold text-lg">
            Estimated total tuition:{" "}
            <span className="font-bold text-blue-900">
              {formatMoney(data.estimated_total)}
            </span>
          </p>
        </div>

        <p className="text-xs text-gray-600 mt-4 leading-relaxed">
          *All tuition and fees are subject to change. Program tuitions are
          estimates only. Your actual tuition and fees are calculated on course
          registrations.
        </p>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Tuition and fees</h2>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          onClick={() => setActiveTab("domestic")}
          className={`px-6 py-3 font-semibold rounded-t-lg border 
            ${activeTab === "domestic" ? "bg-blue-50 text-blue-900 border-b-0" : "text-blue-900 bg-white"}`}
        >
          Domestic Students
        </button>

        <button
          onClick={() => setActiveTab("international")}
          className={`px-6 py-3 font-semibold rounded-t-lg border ml-2
            ${activeTab === "international" ? "bg-blue-50 text-blue-900 border-b-0" : "text-blue-900 bg-white"}`}
        >
          International Students
        </button>
      </div>

      {/* CONTENT */}
      {activeTab === "domestic" && renderTable(domestic)}
      {activeTab === "international" && renderTable(international)}
    </div>
  );
};

export default TuitionSection;
