import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdmissionForm from "./AdmissionsForm";
import { updateAdmission } from "../../../api/admissions";
import { buildApiUrl } from "../../../api";

const EditAdmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Stores the admission loaded from the backend
  const [initialData, setInitialData] = useState(null);

  // Controls loading state while fetching data
  const [loading, setLoading] = useState(true);

  /*
    Fetch the admission by ID from the backend.
    The backend expects the ID as a query parameter (?id=...),
    and returns the item in "result.item".
  */
  useEffect(() => {
    async function fetchAdmission() {
      try {
        //const url = buildApiUrl(`getAdmissionById?id=${id}`);
        const url = buildApiUrl("getAdmissionById") + `?id=${id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (result.success) {
          // Backend returns { success: true, item: {...} }
          setInitialData(result.item);
        } else {
          console.error("Failed to load admission data.");
        }
      } catch (error) {
        console.error("Error loading admission:", error);
      }

      setLoading(false);
    }

    fetchAdmission();
  }, [id]);

  /*
    Handles the update operation.
    Sends the updated data to the backend using updateAdmission().
  */
  const handleSubmit = async (data) => {
    const result = await updateAdmission(id, data);

    if (result.success) {
      navigate("/dashboardadmin/admissions");
    } else {
      alert("Update failed: " + result.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* Reuses the same form component used for creation */}
      <AdmissionForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditAdmission;
