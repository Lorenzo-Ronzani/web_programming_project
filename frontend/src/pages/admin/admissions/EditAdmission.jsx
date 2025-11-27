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

  const [initialData, setInitialData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 1) Load all programs
        const progSnap = await getDocs(collection(db, "programs"));
        const progList = progSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPrograms(progList);

        // 2) Load admission by ID
        const url = buildApiUrl("getAdmissionById") + `?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.item) {
          const item = data.item;

          setInitialData({
            program_id: item.program_id || "",
            title: item.title || "",
            requirements: Array.isArray(item.requirements)
              ? item.requirements.join("\n")
              : item.requirements || "",
            transferability: item.transferability || "",
            language_proficiency: item.language_proficiency || "",
            academic_upgrading: item.academic_upgrading || "",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // 3) Submit update
  const handleSubmit = async (formData) => {
    const payload = {
      ...formData,
      program_id: initialData.program_id, // locked
    };

    const result = await updateAdmission(id, payload);

    if (result.success) {
      navigate("/dashboardadmin/admissions");
    } else {
      alert(result.message || "Update failed");
    }
  };

  // 4) Loading states
  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Admission not found.</p>;

  // 5) Get program name (supports title or name)
  const programObj = programs.find((p) => p.id === initialData.program_id);
  const programName =
    programObj?.title || programObj?.name || "Unknown Program";

  return (
    <AdmissionsForm
      programs={programs}
      initialData={initialData}
      onSubmit={handleSubmit}
      lockProgram={true}
      lockedProgramName={programName}
    />
  );
};

export default EditAdmission;
