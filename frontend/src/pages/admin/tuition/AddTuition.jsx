import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import TuitionForm from "./TuitionForm";
import { createTuition } from "../../../api/tuition";
import { useNavigate } from "react-router-dom";

const AddTuition = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const snap = await getDocs(collection(db, "programs"));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPrograms(items);
      } catch (err) {
        console.error("Error loading programs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const handleSubmit = async (payload) => {
    const res = await createTuition(payload);
    if (res.success) {
      navigate("/dashboardadmin/tuition");
    } else {
      alert(res.message || "Failed to create tuition");
    }
  };

  if (loading) return <p>Loading programs...</p>;

  return <TuitionForm programs={programs} onSubmit={handleSubmit} />;
};

export default AddTuition;
