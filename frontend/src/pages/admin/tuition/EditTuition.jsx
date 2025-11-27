import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import TuitionForm from "./TuitionForm";
import { updateTuition } from "../../../api/tuition";
import { buildApiUrl } from "../../../api";

const EditTuition = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const snap = await getDocs(collection(db, "programs"));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPrograms(items);

        const url = buildApiUrl("getTuitionById") + `?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setInitialData(data.item);
        }
      } catch (err) {
        console.error("Error loading tuition:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  const handleSubmit = async (payload) => {
    const res = await updateTuition(id, payload);
    if (res.success) {
      navigate("/dashboardadmin/tuition");
    } else {
      alert(res.message || "Failed to update tuition");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Tuition not found.</p>;

  return (
    <TuitionForm
      programs={programs}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditTuition;
