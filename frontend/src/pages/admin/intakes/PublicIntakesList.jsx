// ------------------------------------------------------
// PublicIntakesList.jsx - Premium version
// Program (Credential) + Sorting + Search
// ------------------------------------------------------
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const PublicIntakesList = () => {
  const [intakes, setIntakes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Sorting config
  const [sortConfig, setSortConfig] = useState({
    key: "program",
    direction: "asc",
  });

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load intakes
        const intakeSnap = await getDocs(collection(db, "public_intakes"));
        const intakeData = intakeSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Load programs
        const progSnap = await getDocs(collection(db, "programs"));
        const map = {};

        progSnap.docs.forEach((doc) => {
          const data = doc.data();
          const name = `${data.title}${
            data.credential ? ` (${data.credential})` : ""
          }`;
          map[doc.id] = name;
        });

        setProgramsMap(map);
        setIntakes(intakeData);
        setFiltered(intakeData);
      } catch (err) {
        console.error("Error loading public intakes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const text = search.toLowerCase();

    const results = intakes.filter((i) => {
      const program = (programsMap[i.program_id] || "").toLowerCase();
      const starts = (i.starts_in || "").toLowerCase();
      const domestic = (i.domestic_status || "").toLowerCase();
      const international = (i.international_status || "").toLowerCase();
      const enable = (i.enable_status || "").toLowerCase();

      return (
        program.includes(text) ||
        starts.includes(text) ||
        domestic.includes(text) ||
        international.includes(text) ||
        enable.includes(text)
      );
    });

    setFiltered(results);
  }, [search, intakes, programsMap]);

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

      if (key === "starts_in") {
        aVal = a.starts_in || "";
        bVal = b.starts_in || "";
      }

      if (key === "domestic") {
        aVal = a.domestic_status || "";
        bVal = b.domestic_status || "";
      }

      if (key === "international") {
        aVal = a.international_status || "";
        bVal = b.international_status || "";
      }

      if (key === "status") {
        aVal = a.enable_status || "";
        bVal = b.enable_status || "";
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(sorted);
  };

  const arrow = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this intake?")) return;

    await deleteDoc(doc(db, "public_intakes", id));
    setIntakes((prev) => prev.filter((i) => i.id !== id));
  };

  // ENABLE/DISABLE
  const toggleStatus = async (item) => {
    const newStatus =
      item.enable_status === "enabled" ? "disabled" : "enabled";

    await updateDoc(doc(db, "public_intakes", item.id), {
      enable_status: newStatus,
    });

    setIntakes((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, enable_status: newStatus } : i
      )
    );
  };

  if (loading) return <p>Loading Public Intakes...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Public Available Intakes</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search program, dates, statuses..."
            className="border px-3 py-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/dashboardadmin/intakes/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Intake
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b text-gray-700">
            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => sortData("program")}
            >
              Program {arrow("program")}
            </th>

            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => sortData("starts_in")}
            >
              Starts In {arrow("starts_in")}
            </th>

            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => sortData("domestic")}
            >
              Domestic {arrow("domestic")}
            </th>

            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => sortData("international")}
            >
              International {arrow("international")}
            </th>

            <th
              className="py-3 px-2 cursor-pointer"
              onClick={() => sortData("status")}
            >
              Status {arrow("status")}
            </th>

            <th className="py-3 px-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr
              key={item.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="py-3 px-2">
                {programsMap[item.program_id] || "Unknown Program"}
              </td>

              <td className="py-3 px-2">{item.starts_in}</td>

              {/* Domestic */}
              <td className="py-3 px-2">
                <span
                  className={`inline-block h-3 w-3 rounded-full mr-2 ${
                    item.domestic_status === "open"
                      ? "bg-green-500"
                      : item.domestic_status === "closed"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                <span className="capitalize">
                  {item.domestic_status.replace("_", " ")}
                </span>
              </td>

              {/* International */}
              <td className="py-3 px-2">
                <span
                  className={`inline-block h-3 w-3 rounded-full mr-2 ${
                    item.international_status === "open"
                      ? "bg-green-500"
                      : item.international_status === "closed"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                <span className="capitalize">
                  {item.international_status.replace("_", " ")}
                </span>
              </td>

              {/* Enable / Disable */}
              <td className="py-3 px-2">
                <button
                  onClick={() => toggleStatus(item)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.enable_status === "enabled"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {item.enable_status === "enabled" ? "Active" : "Inactive"}
                </button>
              </td>

              <td className="py-3 px-2 flex gap-3">
                <Link
                  to={`/dashboardadmin/intakes/edit/${item.id}`}
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
    </div>
  );
};

export default PublicIntakesList;
