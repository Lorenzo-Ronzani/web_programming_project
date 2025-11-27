import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgramForm from "./ProgramForm";
import { updateProgram } from "../../../api/programs";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const EditProgram = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const ref = doc(db, "programs", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setInitialData(snap.data());
        } else {
          console.error("Program not found");
        }
      } catch (err) {
        console.error("Error loading program:", err);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  const handleSubmit = async (formData) => {
    const result = await updateProgram(id, formData);
    if (result.success) navigate("/dashboardadmin/programs");
    else alert(result.message);
  };

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Program not found.</p>;

  return <ProgramForm initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditProgram;
