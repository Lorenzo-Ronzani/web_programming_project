import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteProgram } from "../../../api/programs";

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    field: "title", // default column
    direction: "asc",
  });

  // Load programs
  const loadPrograms = async () => {
    try {
      const snap = await getDocs(collection(db, "programs"));
      const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPrograms(items);
    } catch (err) {
      console.error("Error loading programs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  // ------------------------------------------------------
  // FILTER + SORT
  // ------------------------------------------------------
  const filteredAndSorted = useMemo(() => {
    const text = search.toLowerCase();

    // FILTER
    const filtered = programs.filter(
      (p) =>
        p.title.toLowerCase().includes(text) ||
        p.credential.toLowerCase().includes(text)
    );

    // SORT
    const sorted = [...filtered];

    sorted.sort((a, b) => {
      let aValue = "";
      let bValue = "";

      if (sortConfig.field === "title") {
        aValue = a.title;
        bValue = b.title;
      }

      if (sortConfig.field === "credential") {
        aValue = a.credential;
        bValue = b.credential;
      }

      if (sortConfig.direction === "asc") {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });

    return sorted;
  }, [programs, search, sortConfig]);

  // ------------------------------------------------------
  // HANDLE COLUMN SORT CLICK
  // ------------------------------------------------------
  const handleSort = (field) => {
    setSortConfig((prev) =>
      prev.field === field
        ? {
            field,
            direction: prev.direction === "asc" ? "desc" : "asc",
          }
        : {
            field,
            direction: "asc",
          }
    );
  };

  // ------------------------------------------------------
  // SORT ICON (same as Intakes UI)
  // ------------------------------------------------------
  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // ------------------------------------------------------
  // DELETE HANDLER
  // ------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete program?")) return;

    const result = await deleteProgram(id);
    if (result.success) loadPrograms();
    else alert(result.message);
  };

  if (loading) return <p>Loading programs...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Programs</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by title or credential..."
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/dashboardadmin/programs/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Program
          </Link>
        </div>
      </div>

      {/* Table */}
      {filteredAndSorted.length === 0 ? (
        <p>No programs found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600 text-sm select-none">

              {/* Title */}
              <th
                onClick={() => handleSort("title")}
                className="py-3 px-2 font-semibold cursor-pointer"
              >
                Title {getSortIcon("title")}
              </th>

              {/* Credential */}
              <th
                onClick={() => handleSort("credential")}
                className="py-3 px-2 font-semibold cursor-pointer"
              >
                Credential {getSortIcon("credential")}
              </th>

              <th className="py-3 px-2 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSorted.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-3 px-2">{p.title}</td>

                <td className="py-3 px-2">{p.credential}</td>

                <td className="py-3 px-2">
                  <div className="flex gap-3">
                    <Link
                      to={`/dashboardadmin/programs/edit/${p.id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};

export default ProgramList;
