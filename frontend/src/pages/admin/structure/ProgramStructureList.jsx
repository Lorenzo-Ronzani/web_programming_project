import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteProgramStructure } from "../../../api/programStructure";

const ProgramStructureList = () => {
  const [items, setItems] = useState([]);
  const [programs, setPrograms] = useState({}); // ← MAP: id → title

  // Load program structure
  const loadStructure = async () => {
    const snap = await getDocs(collection(db, "program_structure"));
    const results = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(results);
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
    loadStructure();
    loadPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this structure?")) return;
    const res = await deleteProgramStructure(id);
    if (res.success) loadStructure();
    else alert(res.message);
  };

  return (
    <div className="bg-white p-8 rounded shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Program Structure</h1>

        <Link
          to="/dashboardadmin/structure/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Structure
        </Link>
      </div>

      {items.length === 0 ? (
        <p>No structures found.</p>
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
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  {programs[item.program_id] || "Not Found"}
                </td>

                <td className="py-3 px-2">{item.terms?.length || 0}</td>

                <td className="flex gap-3 py-3">
                  <Link
                    to={`/dashboardadmin/structure/edit/${item.id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
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
