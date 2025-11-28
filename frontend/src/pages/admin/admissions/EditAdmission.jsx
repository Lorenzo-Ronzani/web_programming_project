// ------------------------------------------------------
// EditAdmission.jsx
// Loads admission data for editing and passes requirements as array.
// ------------------------------------------------------

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdmissionsForm from "./AdmissionsForm";
import { updateAdmission } from "../../../api/admissions";
import { buildApiUrl } from "../../../api";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const EditAdmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [initialData, setInitialData] = useState(null);

  // Load all programs
  useEffect(() => {
    const loadPrograms = async () => {
      const snap = await getDocs(collection(db, "programs"));
      const mapped = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          displayName: `${data.title}${
            data.credential ? ` (${data.credential})` : ""
          }`,
        };
      });

      mapped.sort((a, b) => a.displayName.localeCompare(b.displayName));

      setPrograms(mapped);
    };

    loadPrograms();
  }, []);

  // Load admission data
  useEffect(() => {
    const loadData = async () => {
      const url = buildApiUrl("getAdmissionById") + `?id=${id}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.item) {
        const item = data.item;

        // Requirements MUST be array here
        const arr = Array.isArray(item.requirements)
          ? item.requirements
          : [];

        setInitialData({
          program_id: item.program_id || "",
          title: item.title || "",
          requirements: arr,
          transferability: item.transferability || "",
          language_proficiency: item.language_proficiency || "",
          academic_upgrading: item.academic_upgrading || "",
        });
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (payload) => {
    const res = await updateAdmission(id, payload);

    if (res.success) {
      navigate("/dashboardadmin/admissions");
    } else {
      alert(res.message || "Failed to update admission");
    }
  };

  if (!initialData) return <p>Loading admission...</p>;

  return (
    <AdmissionsForm
      programs={programs}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditAdmission;
