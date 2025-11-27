import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import RequirementsForm from "./RequirementsForm";
import { createRequirement } from "../../../api/requirements";
import { useNavigate } from "react-router-dom";

const AddRequirement = () => {
  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrograms = async () => {
      const snap = await getDocs(collection(db, "programs"));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPrograms(items);
    };

    loadPrograms();
  }, []);

  const handleSubmit = async (formData) => {
    const result = await createRequirement(formData);

    if (result.success) {
      navigate("/dashboardadmin/requirements");
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <RequirementsForm programs={programs} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddRequirement;
