import React, { useState } from "react";
import AdmissionForm from "../../../pages/admin/admissions/AdmissionsForm";
import { createAdmission } from "../../../api/admissions";
import { useNavigate } from "react-router-dom";

const AddAdmission = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      
      const payload = {
        title: formData.title || "",
        
        requirements: Array.isArray(formData.requirements)
          ? formData.requirements
          : (formData.requirements || "")
              .split("\n")
              .map((item) => item.trim())
              .filter((item) => item.length > 0),
        transferability: formData.transferability || "",
        language_proficiency: formData.language_proficiency || "",
        academic_upgrading: formData.academic_upgrading || "",
      };

      const result = await createAdmission(payload);

      if (result.success) {
        setMessage("Admission created successfully!");

        setTimeout(() => {
          navigate("/dashboardadmin/admissions");
        }, 1000);
      } else {
        setMessage(result.message || "Failed to create admission");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unexpected error creating admission");
    }
  };

  return (
    <div>
      {message && (
        <p className="mb-4 text-blue-600 font-medium">{message}</p>
      )}

      <AdmissionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddAdmission;
