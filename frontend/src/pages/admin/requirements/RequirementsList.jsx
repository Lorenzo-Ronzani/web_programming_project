// ------------------------------------------------------
// RequirementsList.jsx - Matching IntakesList visual pattern
// Search + Sorting + DisplayName
// ------------------------------------------------------

import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteRequirement } from "../../../api/requirements";

const RequirementsList = () => {
  const [items, setItems] = useState([]);
  const [programs, setPrograms] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    field: "program",
    direction: "asc",
  });

  // Load requirements
  const loadRequirements = async () => {
    const snap = await getDocs(collection(db, "requirements"));
    setItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Load programs
  const loadPrograms = async () => {
    const snap = await getDocs(collection(db, "programs"));
    const map = {};

    snap.docs.forEach((doc) => {
      const d = doc.data();
      map[doc.id] = `${d.title}${d.credential ? ` (${d.credential})` : ""}`;
    });

    setPrograms(map);
  };

  useEffect(() => {
    Promise.all([loadRequirements(), loadPrograms()]).then(() =>
      setLoading(false)
    );
  }, []);

  // Filter + sort list
  const filteredAndSorted = useMemo(() => {
    const text = search.toLowerCase();

    const filtered = items.filter((item) => {
      const program = (programs[item.program_id] || "").toLowerCase();
      const laptop = (item.laptop || "").toLowerCase();
      const tools = Array.isArray(item.software_tools)
        ? item.software_tools.join(" ").toLowerCase()
        : "";

      return (
        program.includes(text) ||
        laptop.includes(text) ||
        tools.includes(text)
      );
    });

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      let aValue = "";
      let bValue = "";

      if (sortConfig.field === "program") {
        aValue = programs[a.program_id] || "";
        bValue = programs[b.program_id] || "";
      }

      if (sortConfig.field === "laptop") {
        aValue = a.laptop || "";
        bValue = b.laptop || "";
      }

      if (sortConfig.field === "tools") {
        aValue = a.software_tools?.length || 0;
        bValue = b.software_tools?.length || 0;
      }

      if (sortConfig.direction === "asc") {
        return aValue.toString().localeCompare(bValue.toString(), undefined, {
          numeric: true,
        });
      }

      return bValue.toString().localeCompare(aValue.toString(), undefined, {
        numeric: true,
      });
    });

    return sorted;
  }, [items, programs, search, sortConfig]);

  // Sorting icon system (IDENTICAL to Intakes)
  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleSort = (field) => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" }
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete these requirements?")) return;
    const res = await deleteRequirement(id);
    if (res.success) loadRequirements();
  };

  if (loading) return <p>Loading requirements...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Requirements</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search program, laptop, or tools"
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

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600 text-sm select-none">

            {/* Program */}
            <th
              className="py-3 px-2 font-semibold cursor-pointer"
              onClick={() => handleSort("program")}
            >
              Program {getSortIcon("program")}
            </th>

            {/* Laptop */}
            <th
              className="py-3 px-2 font-semibold cursor-pointer"
              onClick={() => handleSort("laptop")}
            >
              Laptop {getSortIcon("laptop")}
            </th>

            {/* Software Tools */}
            <th
              className="py-3 px-2 font-semibold cursor-pointer"
              onClick={() => handleSort("tools")}
            >
              Software Tools {getSortIcon("tools")}
            </th>

            {/* Actions */}
            <th className="py-3 px-2 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAndSorted.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50 text-sm">
              <td className="py-3 px-2">{programs[item.program_id]}</td>
              <td className="py-3 px-2">{item.laptop || "-"}</td>
              <td className="py-3 px-2">{item.software_tools?.length || 0}</td>

              <td className="py-3 px-2">
                <div className="flex gap-3">
                  <Link
                    to={`/dashboardadmin/requirements/edit/${item.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </Link>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default RequirementsList;
