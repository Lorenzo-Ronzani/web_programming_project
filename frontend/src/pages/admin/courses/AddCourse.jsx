import React, { useState } from "react";
import CourseForm from "./CourseForm";
import { createCourse } from "../../../api/courses";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    const result = await createCourse(formData);

    if (result.success) {
      setMessage("Course created successfully!");

      setTimeout(() => {
        navigate("/dashboardadmin/courses");
      }, 1200);
    } else {
      setMessage(result.message || "Error creating course.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      {message && (
        <p className="p-3 bg-blue-100 text-blue-700 rounded mb-4">{message}</p>
      )}

      <CourseForm onSubmit={handleSubmit} />
    </div>
  );
}
