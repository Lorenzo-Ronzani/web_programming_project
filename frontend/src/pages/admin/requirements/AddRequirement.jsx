// ------------------------------------------------------
// AddRequirement.jsx
// Premium Add Form with Combobox search for Programs.
// Consistent with Admissions, Tuition, Structure, Intakes.
// ------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import RequirementsForm from "./RequirementsForm";
import { createRequirement } from "../../../api/requirements";

const AddRequirement = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------
  // Load programs and format displayName: Title (Credential)
  // ------------------------------------------------------
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const snap = await getDocs(collection(db, "programs"));
        const list = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            displayName: `${data.title}${
              data.credential ? ` (${data.credential})` : ""
            }`,
          };
        });

        // Sort alphabetically
        list.sort((a, b) => a.displayName.localeCompare(b.displayName));

        setPrograms(list);
      } catch (error) {
        console.error("Error loading programs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  // ------------------------------------------------------
  // Submit Handler
  // ------------------------------------------------------
  const handleSubmit = async (formData) => {
    const res = await createRequirement(formData);

    if (res.success) {
      navigate("/dashboardadmin/requirements");
    } else {
      alert(res.message || "Failed to create requirement");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <RequirementsForm
      programs={programs}
      onSubmit={handleSubmit}
    />
  );
};

export default AddRequirement;
