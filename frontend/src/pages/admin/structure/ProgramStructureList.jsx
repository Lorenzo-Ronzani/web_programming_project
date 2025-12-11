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

  // SORTING STATE
  const [sortConfig, setSortConfig] = useState({
    key: "program",
    direction: "asc",
  });

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

  // Load programs and map id → {title, credential}
  const loadPrograms = async () => {
    const snap = await getDocs(collection(db, "programs"));
    const map = {};

    snap.docs.forEach((doc) => {
      const data = doc.data();
      map[doc.id] = {
        title: data.title || "(Untitled Program)",
        credential: data.credential || "",
      };
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
      const p = programs[item.program_id] || {};
      const name = `${p.title} ${p.credential}`.toLowerCase();
      const terms = item.terms?.length?.toString() || "";

      return name.includes(text) || terms.includes(text);
    });

    setFiltered(results);
  }, [search, items, programs]);

  // SORT FUNCTION
  const sortData = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;

      if (key === "program") {
        const pa = programs[a.program_id] || {};
        const pb = programs[b.program_id] || {};

        aVal = `${pa.title} ${pa.credential}`.toLowerCase();
        bVal = `${pb.title} ${pb.credential}`.toLowerCase();
      }

      if (key === "terms") {
        aVal = a.terms?.length || 0;
        bVal = b.terms?.length || 0;
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(sorted);
  };

  const sortArrow = (col) => {
    if (sortConfig.key !== col) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

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
              <th
                className="py-3 px-2 cursor-pointer select-none"
                onClick={() => sortData("program")}
              >
                Program {sortArrow("program")}
              </th>

              <th
                className="py-3 px-2 cursor-pointer select-none"
                onClick={() => sortData("terms")}
              >
                Terms {sortArrow("terms")}
              </th>

              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => {
              const p = programs[item.program_id] || {};
              const displayTitle = `${p.title} (${p.credential || "N/A"})`;

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{displayTitle}</td>

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
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProgramStructureList;
