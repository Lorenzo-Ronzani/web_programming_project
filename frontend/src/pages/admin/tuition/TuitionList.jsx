// ------------------------------------------------------
// TuitionList.jsx - Premium version with:
// - Program Name (Credential)
// - Sorting (clickable headers)
// - Smart search
// ------------------------------------------------------
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteTuition } from "../../../api/tuition";

const TuitionList = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "program",
    direction: "asc",
  });

  // Load tuition records
  const loadTuition = async () => {
    const snap = await getDocs(collection(db, "tuition"));
    const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(results);
    setFiltered(results);
  };

  // Load Program Name + Credential
  const loadPrograms = async () => {
    const snap = await getDocs(collection(db, "programs"));
    const map = {};

    snap.docs.forEach((doc) => {
      const d = doc.data();
      map[doc.id] = `${d.title}${d.credential ? ` (${d.credential})` : ""}`;
    });

    setProgramsMap(map);
  };

  useEffect(() => {
    Promise.all([loadTuition(), loadPrograms()]).then(() =>
      setLoading(false)
    );
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const text = search.toLowerCase();

    const results = items.filter((item) => {
      const program = (programsMap[item.program_id] || "").toLowerCase();
      const domestic = String(item.domestic?.estimated_total || "");
      const intl = String(item.international?.estimated_total || "");

      return (
        program.includes(text) ||
        domestic.includes(text) ||
        intl.includes(text)
      );
    });

    setFiltered(results);
  }, [search, items, programsMap]);

  // Sorting Handler
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = [...filtered].sort((a, b) => {
      let aVal = "";
      let bVal = "";

      if (key === "program") {
        aVal = programsMap[a.program_id] || "";
        bVal = programsMap[b.program_id] || "";
      }

      if (key === "domestic") {
        aVal = Number(a.domestic?.estimated_total || 0);
        bVal = Number(b.domestic?.estimated_total || 0);
      }

      if (key === "international") {
        aVal = Number(a.international?.estimated_total || 0);
        bVal = Number(b.international?.estimated_total || 0);
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(sorted);
  };

  const sortArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tuition record?")) return;

    const res = await deleteTuition(id);
    if (res.success) loadTuition();
  };

  if (loading) return <p>Loading tuition...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tuition & Fees</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search program, totals, credential..."
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/dashboardadmin/tuition/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Tuition
          </Link>
        </div>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <p>No tuition records found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th
                className="py-3 px-2 cursor-pointer select-none"
                onClick={() => sortData("program")}
              >
                Program {sortArrow("program")}
              </th>

              <th
                className="py-3 px-2 cursor-pointer select-none"
                onClick={() => sortData("domestic")}
              >
                Domestic Total {sortArrow("domestic")}
              </th>

              <th
                className="py-3 px-2 cursor-pointer select-none"
                onClick={() => sortData("international")}
              >
                International Total {sortArrow("international")}
              </th>

              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  {programsMap[item.program_id] || "Program not found"}
                </td>

                <td className="py-3 px-2">
                  $
                  {Number(item.domestic?.estimated_total || 0).toLocaleString(
                    "en-CA"
                  )}
                </td>

                <td className="py-3 px-2">
                  $
                  {Number(
                    item.international?.estimated_total || 0
                  ).toLocaleString("en-CA")}
                </td>

                <td className="flex gap-3 py-3">
                  <Link
                    to={`/dashboardadmin/tuition/edit/${item.id}`}
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

export default TuitionList;
