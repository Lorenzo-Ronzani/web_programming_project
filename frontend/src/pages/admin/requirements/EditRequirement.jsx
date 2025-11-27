import React, { useEffect, useState } from "react";
import RequirementsForm from "./RequirementsForm";
import { updateRequirement } from "../../../api/requirements";
import { buildApiUrl } from "../../../api";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const EditRequirement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      // Load program list
      const snap = await getDocs(collection(db, "programs"));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPrograms(items);

      // Load requirement data
      const url = buildApiUrl("getRequirementById") + `?id=${id}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setInitialData(data.item);
      }

      setLoading(false);
    };

    loadPage();
  }, [id]);

  const handleSubmit = async (formData) => {
    const result = await updateRequirement(id, formData);

    if (result.success) {
      navigate("/dashboardadmin/requirements");
    } else {
      alert(result.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Not found.</p>;

  return (
    <RequirementsForm
      programs={programs}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditRequirement;
