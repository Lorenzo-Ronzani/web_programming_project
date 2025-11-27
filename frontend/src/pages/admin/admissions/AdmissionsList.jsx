import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { deleteAdmission } from "../../../api/admissions";

const AdmissionsList = () => {
  const [items, setItems] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const admSnap = await getDocs(collection(db, "admissions"));
    const programsSnap = await getDocs(collection(db, "programs"));

    setItems(admSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const map = {};
    programsSnap.docs.forEach((d) => (map[d.id] = d.data().title));
    setProgramsMap(map);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this admission?")) return;

    const res = await deleteAdmission(id);
    if (res.success) loadData();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-8 rounded shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admissions</h1>
        <Link
          to="/dashboardadmin/admissions/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Admission
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-3 px-2">Program</th>
            <th className="py-3 px-2">Title</th>
            <th className="py-3 px-2">Requirements Count</th>
            <th className="py-3 px-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2">{programsMap[item.program_id] || "-"}</td>
              <td className="py-3 px-2">{item.title}</td>
              <td className="py-3 px-2">
                {Array.isArray(item.requirements)
                  ? item.requirements.length
                  : 0}
              </td>

              <td className="py-3 px-2 flex gap-3">
                <Link
                  to={`/dashboardadmin/admissions/edit/${item.id}`}
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
    </div>
  );
};

export default AdmissionsList;
