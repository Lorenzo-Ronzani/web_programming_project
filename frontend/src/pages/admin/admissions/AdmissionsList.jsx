import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

/*
  AdmissionsList.jsx
  ----------------------------------------------------
  - Displays all Admissions entries in Firestore
  - Allows deleting and editing
*/

const AdmissionsList = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all admissions
  const fetchAdmissions = async () => {
    const querySnapshot = await getDocs(collection(db, "admissions"));
    const items = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    setAdmissions(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // Delete an admission
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admission?")) return;

    await deleteDoc(doc(db, "admissions", id));
    fetchAdmissions(); // refresh table
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-8 rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admissions</h1>

        <Link
          to="/dashboardadmin/admissions/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Admission
        </Link>
      </div>

      {admissions.length === 0 ? (
        <p>No admissions found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-2">Title</th>
              <th className="py-3 px-2">Requirements Count</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">{item.title}</td>
                <td className="py-3 px-2">{item.requirements?.length ?? 0}</td>

                <td className="py-3 px-2 flex gap-3">
                  {/* Edit */}
                  <Link
                    to={`/dashboardadmin/admissions/edit/${item.id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default AdmissionsList;
