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
        // carrega programs
        const snap = await getDocs(collection(db, "programs"));
        const progs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPrograms(progs);

        // carrega estrutura pelo backend
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
