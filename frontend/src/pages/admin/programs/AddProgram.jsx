// src/pages/admin/programs/AddProgram.jsx
import React, { useState } from "react";
import ProgramForm from "./ProgramForm";
import { createProgram } from "../../../api/programs";
import { useNavigate } from "react-router-dom";

const AddProgram = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const result = await createProgram(formData);

    if (result.success) {
      setMessage("Program created successfully!");
      setTimeout(() => navigate("/dashboardadmin/programs"), 2000);

    } else {
      setMessage(result.message || "Error creating program");
    }
  };

  return (
    <div>
      {message && <p className="text-blue-600 mb-4">{message}</p>}
      <ProgramForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProgram;
