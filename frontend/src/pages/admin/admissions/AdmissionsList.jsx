// ------------------------------------------------------
// AdmissionsList.jsx - Improved with sorting + better program display
// ------------------------------------------------------
import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteAdmission } from "../../../api/admissions";

const AdmissionsList = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "program",
    direction: "asc",
  });

  // Load data
  const loadData = async () => {
    setLoading(true);

    const admSnap = await getDocs(collection(db, "admissions"));
    const programsSnap = await getDocs(collection(db, "programs"));

    // Admissions data
    const admissions = admSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // Program title + credential map
    const map = {};
    programsSnap.docs.forEach((doc) => {
      const data = doc.data();
      map[doc.id] = `${data.title}${
        data.credential ? ` (${data.credential})` : ""
      }`;
    });

    setProgramsMap(map);
    setItems(admissions);
    setFiltered(admissions);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const text = search.toLowerCase();

    const results = items.filter((item) => {
      const program = (programsMap[item.program_id] || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const credential = program.split("(")[1] || "";
      const reqCount = Array.isArray(item.requirements)
        ? item.requirements.length.toString()
        : "0";

      return (
        program.includes(text) ||
        title.includes(text) ||
        credential.includes(text) ||
        reqCount.includes(text)
      );
    });

    setFiltered(results);
  }, [search, items, programsMap]);

  // SORTING HANDLER
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
      if (key === "title") {
        aVal = a.title || "";
        bVal = b.title || "";
      }
      if (key === "requirements") {
        aVal = Array.isArray(a.requirements) ? a.requirements.length : 0;
        bVal = Array.isArray(b.requirements) ? b.requirements.length : 0;
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(sorted);
  };

  // Arrow helper
  const sortArrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this admission?")) return;

    const res = await deleteAdmission(id);
    if (res.success) loadData();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admissions</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by program, title, credential..."
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/dashboardadmin/admissions/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Admission
          </Link>
        </div>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <p>No admissions found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th
                onClick={() => sortData("program")}
                className="py-3 px-2 cursor-pointer select-none"
              >
                Program {sortArrow("program")}
              </th>

              <th
                onClick={() => sortData("title")}
                className="py-3 px-2 cursor-pointer select-none"
              >
                Title {sortArrow("title")}
              </th>

              <th
                onClick={() => sortData("requirements")}
                className="py-3 px-2 cursor-pointer select-none"
              >
                Requirements {sortArrow("requirements")}
              </th>

              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  {programsMap[item.program_id] || "-"}
                </td>

                <td className="py-3 px-2">{item.title}</td>

                <td className="py-3 px-2">
                  {Array.isArray(item.requirements)
                    ? item.requirements.length
                    : 0}
                </td>

                <td className="py-3 px-2 flex gap-3">
                  <Link
                    to={`/dashboardadmin/admissions/edit/${item.id}`}
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

export default AdmissionsList;
