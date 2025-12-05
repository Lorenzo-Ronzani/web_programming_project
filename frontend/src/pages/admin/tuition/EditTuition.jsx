// ------------------------------------------------------
// EditTuition.jsx
// Loads tuition record, normalizes data, and passes it to TuitionForm
// ------------------------------------------------------

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
    const loadEverything = async () => {
      try {
        // Load program list
        const snap = await getDocs(collection(db, "programs"));
        const list = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            displayName: `${data.title}${data.credential ? ` (${data.credential})` : ""}`,
          };
        });

        list.sort((a, b) => a.displayName.localeCompare(b.displayName));
        setPrograms(list);

        // Fetch tuition record
        const url = buildApiUrl("getTuitionById") + `?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.item) {
          const item = data.item;

          // Build proper objects with totals + terms
          const domesticObj = {
            estimated_total: item.domestic?.estimated_total || 0,
            terms: item.domestic?.terms || [],
          };

          const internationalObj = {
            estimated_total: item.international?.estimated_total || 0,
            terms: item.international?.terms || [],
          };

          setInitialData({
            program_id: item.program_id || "",
            domestic: domesticObj,
            international: internationalObj,
          });
        }
      } catch (err) {
        console.error("Error loading tuition:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEverything();
  }, [id]);

  const handleSubmit = async (formData) => {
    const res = await updateTuition(id, formData);

    if (res.success) {
      navigate("/dashboardadmin/tuition");
    } else {
      alert(res.message || "Failed to update tuition.");
    }
  };

  if (loading) return <p>Loading tuition...</p>;
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
