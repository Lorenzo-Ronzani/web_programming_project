import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgramStructureForm from "./ProgramStructureForm";
import { updateProgramStructure } from "../../../api/programStructure";
import { buildApiUrl } from "../../../api";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const EditProgramStructure = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        // Load programs and courses in parallel
        const [progSnap, courseSnap] = await Promise.all([
          getDocs(collection(db, "programs")),
          getDocs(collection(db, "courses")),
        ]);

        // Programs with displayName
        const progList = progSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            displayName: `${data.title}${
              data.credential ? ` (${data.credential})` : ""
            }`,
          };
        });
        progList.sort((a, b) => a.displayName.localeCompare(b.displayName));
        setPrograms(progList);

        // Courses list
        const courseList = courseSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        courseList.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
        setCourses(courseList);

        // Load existing structure from backend
        const url = buildApiUrl("getProgramStructureById") + `?id=${id}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.item) {
          setInitialData(data.item);
        }
      } catch (err) {
        console.error("Error loading structure:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  // Handle submit from ProgramStructureForm
  const handleSubmit = async (formData) => {
    const res = await updateProgramStructure(id, formData);

    if (res.success) {
      navigate("/dashboardadmin/structure");
    } else {
      alert(res.message || "Failed to update structure.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Structure not found.</p>;

  return (
    <ProgramStructureForm
      programs={programs}
      courses={courses}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditProgramStructure;
