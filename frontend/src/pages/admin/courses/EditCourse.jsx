import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseForm from "./CourseForm";
import { getCourseById, updateCourse } from "../../../api/courses";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        const result = await getCourseById(id);

        if (result && result.success && result.item) {
          setInitialData(result.item);
        } else {
          setMessage("Failed to load course.");
        }
      } catch (err) {
        console.error("Error loading course:", err);
        setMessage("Unexpected error loading course.");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const result = await updateCourse(id, formData);

      if (result && result.success) {
        setMessage("Course updated successfully!");
        setTimeout(() => navigate("/dashboardadmin/courses"), 1200);
      } else {
        setMessage(result?.message || "Error updating course.");
      }
    } catch (err) {
      console.error("Error updating course:", err);
      setMessage("Unexpected error updating course.");
    }
  };

  if (loading) return <p className="p-4">Loading course...</p>;
  if (!initialData) return <p className="p-4">Course not found.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6">
      {message && (
        <p className="p-3 bg-blue-100 text-blue-700 rounded mb-4">
          {message}
        </p>
      )}

      <CourseForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
