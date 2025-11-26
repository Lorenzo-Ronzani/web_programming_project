import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdmissionForm from "./AdmissionsForm";
import { updateAdmission } from "../../../api/admissions";
import { buildApiUrl } from "../../../api";

const EditAdmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmission() {
      try {
        const url = buildApiUrl("getAdmissionById") + `?id=${id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (result.success && result.item) {
          const item = result.item;


          const normalized = {
            title: item.title || "",
            
            requirements: Array.isArray(item.requirements)
              ? item.requirements.join("\n")
              : item.requirements || "",
            transferability: item.transferability || "",
            language_proficiency: item.language_proficiency || "",
            academic_upgrading: item.academic_upgrading || "",
          };

          setInitialData(normalized);
        } else {
          console.error("Failed to load admission data.");
        }
      } catch (error) {
        console.error("Error loading admission:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdmission();
  }, [id]);

  const handleSubmit = async (formData) => {
    
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

    const result = await updateAdmission(id, payload);

    if (result.success) {
      navigate("/dashboardadmin/admissions");
    } else {
      alert("Update failed: " + (result.message || "Unknown error"));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!initialData) {
    return <p>Admission not found.</p>;
  }

  return (
    <div>
      <AdmissionForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditAdmission;
