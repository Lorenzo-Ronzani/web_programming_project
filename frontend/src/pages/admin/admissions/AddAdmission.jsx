import React, { useEffect, useState } from "react";
import AdmissionsForm from "./AdmissionsForm";
import { createAdmission } from "../../../api/admissions";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddAdmission = () => {
  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPrograms() {
      const snap = await getDocs(collection(db, "programs"));

      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          displayName: `${data.title}${
            data.credential ? ` (${data.credential})` : ""
          }`,
        };
      });

      setPrograms(list);
    }

    loadPrograms();
  }, []);

  const handleSubmit = async (formData) => {
    const payload = {
      program_id: formData.program_id,
      title: formData.title,
      requirements: formData.requirements,
      transferability: formData.transferability,
      language_proficiency: formData.language_proficiency,
      academic_upgrading: formData.academic_upgrading,
    };

    const result = await createAdmission(payload);

    if (result.success) {
      navigate("/dashboardadmin/admissions");
    } else {
      setMessage(result.message || "Failed to create admission");
    }
  };

  return (
    <div>
      {message && <p className="mb-4 text-red-600 font-semibold">{message}</p>}

      <AdmissionsForm programs={programs} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddAdmission;
