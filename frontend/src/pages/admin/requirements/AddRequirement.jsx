// ------------------------------------------------------
// AddRequirement.jsx - Create a new program requirement
// ------------------------------------------------------
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import RequirementsForm from "./RequirementsForm";
import { createRequirement } from "../../../api/requirements";
import { useNavigate } from "react-router-dom";

const AddRequirement = () => {
  const [programs, setPrograms] = useState([]);

  // Stores backend validation or error messages
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Load all programs so the user can select one
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const snap = await getDocs(collection(db, "programs"));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPrograms(items);
      } catch (err) {
        console.error("Error loading programs:", err);
        setMessage("Failed to load programs.");
      }
    };

    loadPrograms();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData) => {
    const result = await createRequirement(formData);

    if (result.success) {
      navigate("/dashboardadmin/requirements");
    } else {
      // Display message in the form instead of using alert()
      setMessage(result.message || "Failed to create requirement");
    }
  };

  return (
    <div>
      {/* Display error or backend messages above the form */}
      {message && (
        <p className="mb-4 text-red-600 font-semibold">{message}</p>
      )}

      <RequirementsForm
        programs={programs}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddRequirement;
