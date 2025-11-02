import React, { useState } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";

/*
  Settings.jsx
  ---------------------
  - Shared for both Admin and Student
  - Automatically shows the correct form based on user.role
  - Includes TopBar and Footer
  - Structured layout with sections
*/

const Settings = () => {
  const { user } = useAuth();

  // Default form data (using role detection)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || "student",
    student_id: user?.student_id || "",
    department: user?.department || "",
    position: user?.position || "",
    program: user?.program || "",
    enrollmentDate: user?.enrollmentDate || "",
    phone: user?.phone || "",
    addressNumber: user?.addressNumber || "",
    streetName: user?.streetName || "",
    city: user?.city || "",
    province: user?.province || "",
    postalCode: user?.postalCode || "",
    newPassword: "",
    confirmPassword: "",
    photo:
      user?.photo ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  const [preview, setPreview] = useState(formData.photo);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Update field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload and preview photo
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save (simulate)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setTimeout(() => {
      setMessage("✅ Settings saved successfully!");
    }, 600);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* ✅ TopBar at top */}
      <TopBar />

      {/* ✅ Main content container */}
      <main className="flex-1 flex justify-center pt-24 pb-10 px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Account Settings
          </h2>

          {/* --- Profile Photo & Basic Info --- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
              <div>
                <label
                  htmlFor="photo"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Change Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPG or PNG up to 2MB
                </p>
              </div>
            </div>

            {/* Role and Student ID */}
            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200 w-full sm:w-64">
              <p>
                <span className="font-semibold">Role:</span> {formData.role}
              </p>
              {formData.student_id && (
                <p className="mt-1">
                  <span className="font-semibold">Student ID:</span>{" "}
                  {formData.student_id}
                </p>
              )}
            </div>
          </div>

          {/* --- FORM --- */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 🔹 Section: Personal Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* 🔹 Section: Address */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Address Number"
                  name="addressNumber"
                  value={formData.addressNumber}
                  onChange={handleChange}
                />
                <Input
                  label="Street Name"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleChange}
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input
                  label="Province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* 🔹 Conditional Sections (Role-specific) */}
            {formData.role === "student" ? (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                  />
                  <Input
                    label="Enrollment Date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleChange}
                    type="date"
                  />
                </div>
              </section>
            ) : (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Administrative Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                  <Input
                    label="Position / Title"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
              </section>
            )}

            {/* 🔹 Section: Security */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* Feedback messages */}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            {message && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}

            {/* Submit button */}
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* ✅ Footer at bottom */}
      <Footer />
    </div>
  );
};

/* 🧩 Small reusable input component */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

export default Settings;
