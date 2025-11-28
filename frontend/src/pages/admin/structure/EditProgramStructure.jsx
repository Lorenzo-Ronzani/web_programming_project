// ------------------------------------------------------
// EditProgramStructure.jsx
// Loads programs with displayName and sends them to the form.
// The form will show the program field disabled in Edit mode.
// ------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgramStructureForm from "./ProgramStructureForm";
import { updateProgramStructure } from "../../../api/programStructure";
import { buildApiUrl } from "../../../api";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const EditProgramStructure = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        // Load programs and create displayName
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

        // Load structure from backend
        const url = buildApiUrl("getProgramStructureById") + `?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setInitialData(data.item);
        }
      } catch (err) {
        console.error("Error loading structure:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  const handleSubmit = async (formData) => {
    const res = await updateProgramStructure(id, formData);

    if (res.success) {
      navigate("/dashboardadmin/structure");
    } else {
      alert(res.message || "Failed to update structure");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Structure not found.</p>;

  return (
    <ProgramStructureForm
      programs={programs}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditProgramStructure;
