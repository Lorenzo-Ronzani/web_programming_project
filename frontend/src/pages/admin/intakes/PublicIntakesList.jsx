import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deletePublicIntake } from "../../../api/publicIntakes";

const PublicIntakesList = () => {
  const [items, setItems] = useState([]);
  const [programs, setPrograms] = useState({});

  const loadIntakes = async () => {
    const snap = await getDocs(collection(db, "public_intakes"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadPrograms = async () => {
    const snap = await getDocs(collection(db, "programs"));
    const map = {};
    snap.docs.forEach((d) => (map[d.id] = d.data().title));
    setPrograms(map);
  };

  useEffect(() => {
    loadIntakes();
    loadPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete public intake?")) return;
    const res = await deletePublicIntake(id);
    if (res.success) loadIntakes();
  };

  return (
    <div className="bg-white p-8 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Public Available Intakes</h1>

        <Link
          to="/dashboardadmin/intakes/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Public Intake
        </Link>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-2 px-3">Program</th>
            <th className="py-2 px-3">Starts In</th>
            <th className="py-2 px-3">Domestic</th>
            <th className="py-2 px-3">International</th>
            <th className="py-2 px-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((intake) => (
            <tr key={intake.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3">{programs[intake.program_id]}</td>
              <td className="py-2 px-3">{intake.starts_in}</td>

              <td className="py-2 px-3">
                {intake.domestic === "open" ? "🟢 Open" : "🔴 Closed"}
              </td>
              <td className="py-2 px-3">
                {intake.international === "open" ? "🟢 Open" : "🔴 Closed"}
              </td>

              <td className="py-2 px-3 flex gap-3">
                <Link
                  to={`/dashboardadmin/intakes/edit/${intake.id}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(intake.id)}
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
