import React, { useState } from "react";
import AdmissionForm from "../../../pages/admin/admissions/AdmissionsForm";


import { createAdmission } from "../../../api/admissions";
import { useNavigate } from "react-router-dom";

const AddAdmission = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await createAdmission(data);
      setMessage("Admission created successfully!");

      // redirect after save
      setTimeout(() => {
        navigate("/dashboardadmin/admissions");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Add Admission</h1>

      {message && (
        <p className="mb-4 text-blue-600 font-medium">{message}</p>
      )}

      {/* --- Aqui o formulário aparece de verdade --- */}
      <AdmissionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddAdmission;
