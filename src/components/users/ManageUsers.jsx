import React, { useEffect, useState } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../api";

/*
  ManageUsers.jsx (API Version)
  --------------------------------------------------
  - Loads users from backend API (Firebase Functions)
  - Supports search, edit navigation, and status toggle
  - Fully removes JSON dependencies
*/

const ManageUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(buildApiUrl("getUsers"));
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // 🔍 Filter users
  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(q) ||
      user.lastName.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });

  // Toggle active/inactive (frontend only for now)
  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.student_id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  // Navigation
  const handleEdit = (user) => navigate(`/useredit/${user.student_id}`);
  const handleAddUser = () => navigate("/useradd");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading users...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 container mx-auto px-6 py-8">

        {/* Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Manage Users</h2>
          <p className="text-gray-500 mt-1">
            View, search, and manage user accounts.
          </p>
        </div>

        {/* Search + Add button */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">User List</h3>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
              >
                + Add User
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 text-gray-600">ID</th>
                <th className="py-2 px-3 text-gray-600">Name</th>
                <th className="py-2 px-3 text-gray-600">Email</th>
                <th className="py-2 px-3 text-gray-600">Role</th>
                <th className="py-2 px-3 text-gray-600 text-center">Status</th>
                <th className="py-2 px-3 text-gray-600 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.student_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-3 text-sm text-gray-700">
                    {user.student_id}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-700">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-700 capitalize">
                    {user.role}
                  </td>

                  {/* Status toggle */}
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(user.student_id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>

                  {/* Edit button */}
                  <td className="py-2 px-3 text-sm text-right">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              No users found.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManageUsers;
