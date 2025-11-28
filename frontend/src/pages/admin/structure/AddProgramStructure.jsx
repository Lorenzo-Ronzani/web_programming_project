import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProgramStructureForm from "./ProgramStructureForm";
import { createProgramStructure } from "../../../api/programStructure";
import { useNavigate } from "react-router-dom";

const AddProgramStructure = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const snap = await getDocs(collection(db, "programs"));
        const items = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrograms(items);
      } catch (err) {
        console.error("Error loading programs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const handleSubmit = async (data) => {
    const res = await createProgramStructure(data);
    if (res.success) {
      setMessage("Program structure created successfully!");
      setTimeout(() => {
        navigate("/dashboardadmin/structure");
      }, 1000);
    } else {
      setMessage(res.message || "Failed to create program structure");
    }
  };

  if (loading) return <p>Loading programs...</p>;

  return (
    <div>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <ProgramStructureForm programs={programs} onSubmit={handleSubmit} />
      {message && <p className="mb-4 text-red-600">{message}</p>}
    </div>
  );
};

export default AddProgramStructure;
