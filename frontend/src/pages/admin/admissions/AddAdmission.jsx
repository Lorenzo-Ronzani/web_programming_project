import React, { useEffect, useState } from "react";
import AdmissionsForm from "./AdmissionsForm";
import { createAdmission } from "../../../api/admissions";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddAdmission = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPrograms() {
      const snap = await getDocs(collection(db, "programs"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPrograms(list);
    }
    loadPrograms();
  }, []);

  const handleSubmit = async (formData) => {
    const payload = {
      program_id: formData.program_id, // FIXED
      title: formData.title,           // FIXED
      requirements: formData.requirements,
      transferability: formData.transferability,
      language_proficiency: formData.language_proficiency,
      academic_upgrading: formData.academic_upgrading,
    };

    const result = await createAdmission(payload);

    if (result.success) {
      navigate("/dashboardadmin/admissions");
    } else {
      alert(result.message || "Failed to create admission");
    }
  };

  return (
    <AdmissionsForm
      programs={programs}
      onSubmit={handleSubmit}
    />
  );
};

export default AddAdmission;
