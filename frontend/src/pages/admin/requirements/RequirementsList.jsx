// ------------------------------------------------------
// RequirementsList.jsx - Clean UI + Search + JOIN programs
// ------------------------------------------------------
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteRequirement } from "../../../api/requirements";

const RequirementsList = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [programs, setPrograms] = useState({}); // map id → title
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load requirements
  const loadRequirements = async () => {
    const snap = await getDocs(collection(db, "requirements"));
    const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(results);
    setFiltered(results);
  };

  // Load programs and build a map
  const loadPrograms = async () => {
    const snap = await getDocs(collection(db, "programs"));
    const map = {};

    snap.docs.forEach((doc) => {
      const d = doc.data();
      map[doc.id] = d.title || "(Untitled Program)";
    });

    setPrograms(map);
  };

  useEffect(() => {
    Promise.all([loadRequirements(), loadPrograms()]).then(() =>
      setLoading(false)
    );
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const text = search.toLowerCase();

    const results = items.filter((item) => {
      const programName = (programs[item.program_id] || "").toLowerCase();
      const toolsCount = (item.software_tools?.length || 0).toString();

      return (
        programName.includes(text) ||
        toolsCount.includes(text)
      );
    });

    setFiltered(results);
  }, [search, items, programs]);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete these requirements?")) return;

    const res = await deleteRequirement(id);
    if (res.success) loadRequirements();
    else alert(res.message);
  };

  if (loading) return <p>Loading requirements...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Requirements</h1>

        <div className="flex gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search program or tools count..."
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/dashboardadmin/requirements/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Requirement
          </Link>
        </div>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <p>No requirements found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2">Program</th>
              <th className="py-3 px-2">Software Tools</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                {/* Program Name */}
                <td className="py-3 px-2">
                  {programs[item.program_id] || "Program not found"}
                </td>

                {/* Software Tools count */}
                <td className="py-3 px-2">
                  {item.software_tools?.length || 0}
                </td>

                {/* Actions */}
                <td className="flex gap-3 py-3">
                  <Link
                    to={`/dashboardadmin/requirements/edit/${item.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequirementsList;
