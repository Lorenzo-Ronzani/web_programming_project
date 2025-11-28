// ------------------------------------------------------
// EditRequirement.jsx
// Loads requirement by ID, loads programs with displayName,
// passes everything to RequirementsForm in Edit mode.
// Program field is locked (read-only) inside the form.
// ------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import RequirementsForm from "./RequirementsForm";
import { buildApiUrl } from "../../../api";
import { updateRequirement } from "../../../api/requirements";

const EditRequirement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------
  // Load Programs
  // ------------------------------------------------------
  useEffect(() => {
    const loadAll = async () => {
      try {
        // Load programs from Firestore
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

        // Sort A → Z
        list.sort((a, b) => a.displayName.localeCompare(b.displayName));
        setPrograms(list);

        // ------------------------------------------------------
        // Load Requirement by API
        // ------------------------------------------------------
        const url = buildApiUrl("getRequirementById") + `?id=${id}`;
        const res = await fetch(url);
        const dataResult = await res.json();

        if (dataResult.success && dataResult.item) {
          const item = dataResult.item;

          setInitialData({
            program_id: item.program_id || "",
            laptop: item.laptop || "",
            software_tools: Array.isArray(item.software_tools)
              ? item.software_tools
              : [],
          });
        }
      } catch (error) {
        console.error("Error loading requirement:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  // ------------------------------------------------------
  // Submit Handler
  // ------------------------------------------------------
  const handleSubmit = async (formData) => {
    const res = await updateRequirement(id, formData);

    if (res.success) {
      navigate("/dashboardadmin/requirements");
    } else {
      alert(res.message || "Failed to update requirement");
    }
  };

  if (loading) return <p>Loading requirement...</p>;
  if (!initialData) return <p>Requirement not found.</p>;

  return (
    <RequirementsForm
      programs={programs}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditRequirement;
