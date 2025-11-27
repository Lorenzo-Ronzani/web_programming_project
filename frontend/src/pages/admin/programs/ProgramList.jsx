import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteProgram } from "../../../api/programs";

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPrograms = async () => {
    try {
      const snap = await getDocs(collection(db, "programs"));
      const items = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPrograms(items);
      setLoading(false);
    } catch (err) {
      console.error("Error loading programs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();   // ❗ CORRETO — não é async no useEffect
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete program?")) return;

    const result = await deleteProgram(id);
    if (result.success) {
      loadPrograms(); // refresh
    } else {
      alert(result.message);
    }
  };

  if (loading) return <p>Loading programs...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Programs</h1>

        <Link
          to="/dashboardadmin/programs/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Program
        </Link>
      </div>

      {programs.length === 0 ? (
        <p>No programs found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2">Title</th>
              <th className="py-3 px-2">Credential</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {programs.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">{p.title}</td>
                <td className="py-3 px-2">{p.credential}</td>

                <td className="flex gap-3 py-3">
                  <Link
                    to={`/dashboardadmin/programs/edit/${p.id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
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

export default ProgramList;
