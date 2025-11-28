// ------------------------------------------------------
// AddTuition.jsx - Create a new tuition entry
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

  // Stores message for user feedback (success or error)
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Load all programs from Firestore
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const snap = await getDocs(collection(db, "programs"));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

  // Form submission handler
  const handleSubmit = async (payload) => {
    const res = await createTuition(payload);

    if (res.success) {
      navigate("/dashboardadmin/tuition");
    } else {
      // Show the message inside the form instead of alert()
      setMessage(res.message || "Failed to create tuition");
    }
  };

  if (loading) return <p>Loading programs...</p>;

  return (
    <div>
      {/* Display backend message above the form */}
      {message && (
        <p className="mb-4 text-red-600 font-semibold">{message}</p>
      )}

      <TuitionForm
        programs={programs}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddTuition;
