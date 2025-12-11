import React, { useEffect, useState } from "react";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../api";

const ProgramRegistration = () => {
  const { user } = useAuth();
  const studentId = user?.student_id || user?.studentId || "";

  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const [studentProgram, setStudentProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  // ------------------------------------------------------------
  // Load programs and studentProgram
  // ------------------------------------------------------------
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      resetFeedback();

      try {
        // Load student program
        const spRes = await fetch(
          buildApiUrl("getStudentProgram") + `?student_id=${studentId}`
        );
        const spJson = await spRes.json();

        if (spJson?.success && spJson.item) {
          setStudentProgram(spJson.item);
          setSelectedProgramId(spJson.item.program_id);
        }

        // Load available programs
        const pRes = await fetch(buildApiUrl("getPrograms"));
        const pJson = await pRes.json();

        if (pJson?.success && Array.isArray(pJson.items)) {
          setPrograms(pJson.items);
        } else if (Array.isArray(pJson)) {
          setPrograms(pJson);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load program data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  // ------------------------------------------------------------
  // Register student in selected program
  // ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!selectedProgramId) {
      setError("Please select a program.");
      return;
    }

    if (
      studentProgram?.program_id &&
      studentProgram.program_id === selectedProgramId
    ) {
      setError("You are already registered in this program.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(buildApiUrl("registerProgram"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          program_id: selectedProgramId,
        }),
      });

      const json = await res.json();

      if (!json?.success) {
        setError(json?.message || "Program registration failed.");
        return;
      }

      setStudentProgram(json.item);
      setMessage("Program registered successfully! Redirecting...");

      // Redirect after creating the program
      setTimeout(() => {
        window.location.href = "/courseregistration";
      }, 1200);

    } catch (err) {
      console.error(err);
      setError("Network error during program registration.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />

      <main className="container mx-auto flex-1 px-6 py-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Program Registration
        </h1>

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            {studentProgram && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <p>
                  Currently registered in:{" "}
                  <strong>{studentProgram.program_title}</strong>
                </p>
                <p>Current term: {studentProgram.current_term}</p>
              </div>
            )}

            <label className="mb-2 block text-sm font-medium">
              Select a Program
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2"
              disabled={saving}
            >
              <option value="">-- choose a program --</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.credential}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Register Program"}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProgramRegistration;
