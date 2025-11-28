// ------------------------------------------------------
// ProgramStructureList.jsx
// Added: Search bar + filtered results (like User List)
// ------------------------------------------------------
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteProgramStructure } from "../../../api/programStructure";

const ProgramStructureList = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [programs, setPrograms] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load program structure
  const loadStructure = async () => {
    const snap = await getDocs(collection(db, "program_structure"));
    const results = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setItems(results);
    setFiltered(results);
  };

  // Load programs and map id → title
  const loadPrograms = async () => {
    const snap = await getDocs(collection(db, "programs"));
    const map = {};

    snap.docs.forEach((doc) => {
      map[doc.id] = doc.data().title || "(Untitled Program)";
    });

    setPrograms(map);
  };

  useEffect(() => {
    Promise.all([loadStructure(), loadPrograms()]).then(() =>
      setLoading(false)
    );
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const text = search.toLowerCase();

    const results = items.filter((item) => {
      const programName = (programs[item.program_id] || "").toLowerCase();
      const terms = item.terms?.length?.toString() || "";

      return (
        programName.includes(text) ||
        terms.includes(text)
      );
    });

    setFiltered(results);
  }, [search, items, programs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this structure?")) return;

    const res = await deleteProgramStructure(id);
    if (res.success) loadStructure();
    else alert(res.message);
  };

  if (loading) return <p>Loading Program Structure...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Program Structure</h1>

        <div className="flex gap-3">
          {/* SEARCH INPUT */}
          <input
            type="text"
            placeholder="Search by program or terms..."
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/dashboardadmin/structure/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Structure
          </Link>
        </div>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2">Program</th>
              <th className="py-3 px-2">Terms</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  {programs[item.program_id] || "Not Found"}
                </td>

                <td className="py-3 px-2">{item.terms?.length || 0}</td>

                <td className="flex gap-3 py-3">
                  <Link
                    to={`/dashboardadmin/structure/edit/${item.id}`}
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

export default ProgramStructureList;
