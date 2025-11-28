// ------------------------------------------------------
// AddPublicIntake.jsx - Premium version with displayName
// ------------------------------------------------------
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PublicIntakesForm from "./PublicIntakesForm";
import { createPublicIntake } from "../../../api/publicIntakes";
import { useNavigate } from "react-router-dom";

const AddPublicIntake = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrograms = async () => {
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

      // alphabetical order
      items.sort((a, b) => a.displayName.localeCompare(b.displayName));

      setPrograms(items);
    };

    loadPrograms();
  }, []);

  const handleSubmit = async (payload) => {
    const res = await createPublicIntake(payload);

    if (res.success) navigate("/dashboardadmin/intakes");
    else alert(res.message || "Error creating intake");
  };

  return <PublicIntakesForm programs={programs} onSubmit={handleSubmit} />;
};

export default AddPublicIntake;
