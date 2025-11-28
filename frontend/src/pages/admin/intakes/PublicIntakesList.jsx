// ------------------------------------------------------
// PublicIntakesList.jsx - Search + JOIN Programs + Clean UI
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
  const [programMap, setProgramMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Load intakes + programs (JOIN)
  useEffect(() => {
    const loadData = async () => {
      try {
        const intakeSnap = await getDocs(collection(db, "public_intakes"));
        const intakeItems = intakeSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setIntakes(intakeItems);
        setFiltered(intakeItems); // initialize list

        // Load programs
        const programSnap = await getDocs(collection(db, "programs"));
        const map = {};
        programSnap.docs.forEach((d) => {
          map[d.id] = d.data().title;
        });
        setProgramMap(map);
      } catch (err) {
        console.error("Error loading list:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const text = search.toLowerCase();

    const results = intakes.filter((item) => {
      const program = (programMap[item.program_id] || "").toLowerCase();
      const starts = (item.starts_in || "").toLowerCase();
      const domestic = (item.domestic_status || "").toLowerCase();
      const international = (item.international_status || "").toLowerCase();
      const enable = (item.enable_status || "").toLowerCase();

      return (
        program.includes(text) ||
        starts.includes(text) ||
        domestic.includes(text) ||
        international.includes(text) ||
        enable.includes(text)
      );
    });

    setFiltered(results);
  }, [search, intakes, programMap]);

  // Delete intake
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this public intake?"))
      return;

    await deleteDoc(doc(db, "public_intakes", id));
    setIntakes(intakes.filter((i) => i.id !== id));
  };

  // Toggle enable / disable
  const toggleStatus = async (intake) => {
    const newStatus =
      intake.enable_status === "enabled" ? "disabled" : "enabled";

    await updateDoc(doc(db, "public_intakes", intake.id), {
      enable_status: newStatus,
    });

    setIntakes((prev) =>
      prev.map((i) =>
        i.id === intake.id ? { ...i, enable_status: newStatus } : i
      )
    );
  };

  if (loading) return <p>Loading public intakes...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Public Available Intakes</h2>

        <div className="flex gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            to="/dashboardadmin/intakes/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Public Intake
          </Link>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-700 border-b">
            <th className="py-2 px-3">Program</th>
            <th className="py-2 px-3">Starts In</th>
            <th className="py-2 px-3">Domestic</th>
            <th className="py-2 px-3">International</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((intake) => (
            <tr key={intake.id} className="border-b">
              {/* Program Title */}
              <td className="py-3 px-3">
                {programMap[intake.program_id] || "Unknown Program"}
              </td>

              {/* Starts In */}
              <td className="py-3 px-3">{intake.starts_in}</td>

              {/* Domestic */}
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      intake.domestic_status === "open"
                        ? "bg-green-500"
                        : intake.domestic_status === "closed"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="capitalize">
                    {(intake.domestic_status || "").replace("_", " ")}
                  </span>
                </div>
              </td>

              {/* International */}
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      intake.international_status === "open"
                        ? "bg-green-500"
                        : intake.international_status === "closed"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="capitalize">
                    {(intake.international_status || "").replace("_", " ")}
                  </span>
                </div>
              </td>

              {/* Enable / Disable */}
              <td className="py-3 px-3">
                <button
                  onClick={() => toggleStatus(intake)}
                  className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition ${
                    intake.enable_status === "enabled"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {intake.enable_status === "enabled" ? "Active" : "Inactive"}
                </button>
              </td>

              {/* Actions */}
              <td className="py-3 px-3 flex gap-2">
                <Link
                  to={`/dashboardadmin/intakes/edit/${intake.id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(intake.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
