// ------------------------------------------------------
// EditTuition.jsx
// Loads tuition data and formats domestic/international
// so the TuitionForm always receives valid arrays.
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
    const loadAll = async () => {
      try {
        // ------------------------------------------------------
        // Load programs and create displayName
        // ------------------------------------------------------
        const snap = await getDocs(collection(db, "programs"));

        const list = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            displayName: `${data.title}${
              data.credential ? ` (${data.credential})` : ""
            }`,
          };
        });

        // Sort programs alphabetically
        list.sort((a, b) => a.displayName.localeCompare(b.displayName));

        setPrograms(list);

        // ------------------------------------------------------
        // Load tuition record from backend
        // ------------------------------------------------------
        const url = buildApiUrl("getTuitionById") + `?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.item) {
          const item = data.item;

          // ------------------------------------------------------
          // Normalize domestic terms
          // domestic can be:
          // - array
          // - { estimated_total, terms: [...] }
          // - undefined
          // ------------------------------------------------------
          const domesticTerms = Array.isArray(item.domestic)
            ? item.domestic
            : Array.isArray(item.domestic?.terms)
            ? item.domestic.terms
            : [];

          // ------------------------------------------------------
          // Normalize international terms
          // international can be:
          // - array
          // - { estimated_total, terms: [...] }
          // - undefined
          // ------------------------------------------------------
          const internationalTerms = Array.isArray(item.international)
            ? item.international
            : Array.isArray(item.international?.terms)
            ? item.international.terms
            : [];

          // ------------------------------------------------------
          // Set final initial data for the form
          // ------------------------------------------------------
          setInitialData({
            program_id: item.program_id || "",
            domestic: domesticTerms,
            international: internationalTerms,
          });
        }
      } catch (err) {
        console.error("Error loading tuition:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  // ------------------------------------------------------
  // Submit handler
  // ------------------------------------------------------
  const handleSubmit = async (formData) => {
    const res = await updateTuition(id, formData);

    if (res.success) {
      navigate("/dashboardadmin/tuition");
    } else {
      alert(res.message || "Failed to update tuition");
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
