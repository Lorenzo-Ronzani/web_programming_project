import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProgramStructureForm from "./ProgramStructureForm";
import { createProgramStructure } from "../../../api/programStructure";
import { useNavigate } from "react-router-dom";

const AddProgramStructure = () => {
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load programs and courses in parallel
    const loadData = async () => {
      try {
        const [progSnap, courseSnap] = await Promise.all([
          getDocs(collection(db, "programs")),
          getDocs(collection(db, "courses")),
        ]);

        // Map programs with displayName
        const progItems = progSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            displayName: `${data.title}${
              data.credential ? ` (${data.credential})` : ""
            }`,
          };
        });

        progItems.sort((a, b) => a.displayName.localeCompare(b.displayName));
        setPrograms(progItems);

        // Map courses
        const courseItems = courseSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Optional: sort courses by code
        courseItems.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
        setCourses(courseItems);
      } catch (err) {
        console.error("Error loading programs or courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handles submit from ProgramStructureForm
  const handleSubmit = async (payload) => {
    const res = await createProgramStructure(payload);

    if (res.success) {
      setMessage("Program structure created successfully.");
      setTimeout(() => {
        navigate("/dashboardadmin/structure");
      }, 1000);
    } else {
      setMessage(res.message || "Failed to create program structure.");
    }
  };

  if (loading) {
    return <p>Loading programs and courses...</p>;
  }

  return (
    <div>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <ProgramStructureForm
        programs={programs}
        courses={courses}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddProgramStructure;
