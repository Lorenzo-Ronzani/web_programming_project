import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { buildApiUrl } from "../../api";

const UserForm = () => {
  const { id } = useParams(); // studentId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Data (same as Settings page)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressNumber: "",
    streetName: "",
    city: "",
    province: "",
    postalCode: "",
    photo: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    role: "student",
  });

  const [preview, setPreview] = useState(formData.photo);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(buildApiUrl("getUsers"));
        const allUsers = await res.json();

        const user = allUsers.find((u) => u.studentId === id);
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.username || user.email || "",
            phone: user.phone || "",
            addressNumber: user.addressNumber || "",
            streetName: user.streetName || "",
            city: user.city || "",
            province: user.province || "",
            postalCode: user.postalCode || "",
            photo: user.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            role: user.role || "student",
          });

          setPreview(
            user.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          );
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  // =============================== HANDLERS ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(buildApiUrl("updateUserProfileAdmin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: id,
          ...formData,
          photo: preview,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Failed to update user.");
      } else {
        setMessage("User updated successfully!");
        setTimeout(() => navigate("/manageusers"), 800);
      }
    } catch (err) {
      console.error(err);
      setError("Error saving changes.");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading user...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 flex justify-center pt-8 pb-10 px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Edit User Account
          </h2>

          {/* PHOTO + ROLE */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex items-center gap-4">
              <img
                src={preview}
                className="w-20 h-20 rounded-full object-cover border"
              />

              <div>
                <label
                  htmlFor="photo"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Change Photo
                </label>

                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            {/* Role Selector */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PERSONAL INFO */}
            <Section title="Personal Information">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              <Input label="Email Address" name="email" value={formData.email} disabled />
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </Section>

            {/* ADDRESS */}
            <Section title="Address">
              <Input label="Address Number" name="addressNumber" value={formData.addressNumber} onChange={handleChange} />
              <Input label="Street Name" name="streetName" value={formData.streetName} onChange={handleChange} />
              <Input label="City" name="city" value={formData.city} onChange={handleChange} />
              <Input label="Province" name="province" value={formData.province} onChange={handleChange} />
              <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
            </Section>

            {error && <p className="text-red-600 text-center">{error}</p>}
            {message && <p className="text-green-600 text-center">{message}</p>}

            <div className="text-right">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Section = ({ title, children }) => (
  <section>
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </section>
);

const Input = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      disabled={disabled}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default UserForm;
