import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import PublicIntakesForm from "./PublicIntakesForm";
import { updatePublicIntake } from "../../../api/publicIntakes";
import { buildApiUrl } from "../../../api";

const EditPublicIntake = () => {
  const { id } = useParams();
  const [programs, setPrograms] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const snap = await getDocs(collection(db, "programs"));
      setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const url = buildApiUrl("getPublicIntakeById") + `?id=${id}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) setInitialData(data.item);
    };

    loadData();
  }, [id]);

  const handleSubmit = async (payload) => {
    const res = await updatePublicIntake(id, payload);
    if (res.success) navigate("/dashboardadmin/intakes");
    else alert(res.message);
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <PublicIntakesForm
      programs={programs}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditPublicIntake;
