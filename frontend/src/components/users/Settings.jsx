import React, { useState, useEffect } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";

/*
  Settings Page
  ---------------------------------------------------------
  Displays and updates user profile information.
  - Uses required fields:
      phone, addressNumber, streetName, city, province, postalCode
  - Applies basic formatting for phone and postal code
  - Syncs changes with Firestore through updateUserProfile
*/

const Settings = () => {
  const { user, updateUserProfile } = useAuth();

  // Local state to hold form data
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
    newPassword: "",
    confirmPassword: "",
    photo: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  const [preview, setPreview] = useState(formData.photo);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /*
    Initialize form when user data is available
  */
  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.username || user.email || "",
      phone: user.phone || "",
      addressNumber: user.addressNumber || "",
      streetName: user.streetName || "",
      city: user.city || "",
      province: user.province || "",
      postalCode: user.postalCode || "",
      photo:
        user.photo ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    }));

    setPreview(
      user.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    );
  }, [user]);

  /*
    Helper: format Canadian phone number
    Example format: +1 (403) 555-0000
  */
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11); // 1 + 10 digits
    if (!digits) return "";

    // If starts without country code, assume +1
    let formatted = digits;

    if (formatted.length <= 1) {
      return `+${formatted}`;
    }

    // Ensure it starts with country code 1
    if (formatted[0] !== "1") {
      formatted = "1" + formatted;
    }

    const country = formatted[0];
    const area = formatted.slice(1, 4);
    const first = formatted.slice(4, 7);
    const last = formatted.slice(7, 11);

    let result = `+${country}`;
    if (area) result += ` (${area}`;
    if (area && area.length === 3) result += `)`;
    if (first) result += ` ${first}`;
    if (last) result += `-${last}`;
    return result;
  };

  /*
    Helper: format Canadian postal code
    Pattern: A1A 1A1
  */
  const formatPostalCode = (value) => {
    const raw = value.replace(/\s+/g, "").toUpperCase();
    const trimmed = raw.slice(0, 6); // A1A1A1

    if (!trimmed) return "";

    if (trimmed.length <= 3) {
      return trimmed;
    }

    return trimmed.slice(0, 3) + " " + trimmed.slice(3);
  };

  /*
    Helper: allow only numbers for addressNumber
  */
  const formatAddressNumber = (value) => {
    return value.replace(/\D/g, "");
  };

  /*
    Generic change handler with field-specific formatting
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    if (name === "postalCode") {
      formattedValue = formatPostalCode(value);
    }

    if (name === "addressNumber") {
      formattedValue = formatAddressNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  /*
    Photo Upload Preview
  */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /*
    Validate required fields before saving
  */
  const validateRequiredFields = () => {
    if (!formData.phone) return "Phone number is required.";
    if (!formData.addressNumber) return "Address number is required.";
    if (!formData.streetName) return "Street name is required.";
    if (!formData.city) return "City is required.";
    if (!formData.province) return "Province is required.";
    if (!formData.postalCode) return "Postal code is required.";

    return null;
  };

  /*
    Submit updated data to Firestore
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Frontend password change is not wired to Firebase Auth yet
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      // You can later integrate a call to update password in Firebase Auth here
    }

    const validationError = validateRequiredFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    const allowedUpdateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      addressNumber: formData.addressNumber,
      streetName: formData.streetName,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      photo: preview,
    };

    setSaving(true);

    const result = await updateUserProfile(allowedUpdateData);

    setSaving(false);

    if (!result.success) {
      setError(result.message || "Failed to save changes.");
      return;
    }

    setMessage("Settings saved successfully.");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 flex justify-center pt-24 pb-10 px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Account Settings
          </h2>

          {/* USER PHOTO & ROLE INFO */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Profile"
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

                <p className="text-xs text-gray-500 mt-1">
                  JPG or PNG up to 2MB
                </p>
              </div>
            </div>

            <div className="text-sm border bg-gray-50 p-4 rounded-lg w-full sm:w-64">
              <p>
                <strong>Role:</strong> {user?.role ?? "student"}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PERSONAL INFORMATION */}
            <Section title="Personal Information">
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
                value={formData.email}
                disabled
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder='+1 (403) 555-0000'
              />
            </Section>

            {/* ADDRESS */}
            <Section title="Address">
              <Input
                label="Address Number"
                name="addressNumber"
                value={formData.addressNumber}
                onChange={handleChange}
                placeholder="100"
              />
              <Input
                label="Street Name"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                placeholder="Campus Drive NW"
              />
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Calgary"
              />
              <Input
                label="Province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="Alberta"
              />
              <Input
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="T2M 4N3"
              />
            </Section>

            {/* SECURITY */}
            {/*
            <Section title="Security">
              
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
            </Section>
            */}

            {/* FEEDBACK */}
            {error && <p className="text-red-600 text-center">{error}</p>}
            {message && (
              <p className="text-green-600 text-center">{message}</p>
            )}

            {/* SAVE BUTTON */}
            <div className="text-right">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-lg text-white ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
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

/* Small reusable form section wrapper */
const Section = ({ title, children }) => (
  <section>
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </section>
);

/* Reusable input field */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

export default Settings;
