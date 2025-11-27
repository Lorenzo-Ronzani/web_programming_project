import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteTuition } from "../../../api/tuition";

const TuitionList = () => {
  const [items, setItems] = useState([]);
  const [programs, setPrograms] = useState({});

  const loadTuition = async () => {
    const snap = await getDocs(collection(db, "tuition"));
    const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(results);
  };

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
    loadTuition();
    loadPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tuition record?")) return;
    const res = await deleteTuition(id);
    if (res.success) loadTuition();
    else alert(res.message || "Failed to delete tuition");
  };

  return (
    <div className="bg-white p-8 rounded shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tuition & Fees</h1>

        <Link
          to="/dashboardadmin/tuition/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Tuition
        </Link>
      </div>

      {items.length === 0 ? (
        <p>No tuition records found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2">Program</th>
              <th className="py-3 px-2">Domestic total</th>
              <th className="py-3 px-2">International total</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  {programs[item.program_id] || "Program not found"}
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

export default TuitionList;
