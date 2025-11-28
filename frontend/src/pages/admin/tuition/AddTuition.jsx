// ------------------------------------------------------
// AddTuition.jsx - Premium version with displayName
// ------------------------------------------------------
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import TuitionForm from "./TuitionForm";
import { createTuition } from "../../../api/tuition";
import { useNavigate } from "react-router-dom";

const AddTuition = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const snap = await getDocs(collection(db, "programs"));
        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            displayName: `${data.title}${
              data.credential ? ` (${data.credential})` : ""
            }`,
          };
        });

        // Ordenação alfabética
        items.sort((a, b) => a.displayName.localeCompare(b.displayName));

        setPrograms(items);
      } catch (err) {
        console.error("Error loading programs:", err);
        setMessage("Failed to load programs.");
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
      setMessage(res.message || "Failed to create tuition");
    }
  };

  if (loading) return <p>Loading programs...</p>;

  return (
    <div>
      {message && <p className="mb-4 text-red-600 font-semibold">{message}</p>}

      <TuitionForm programs={programs} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddTuition;
