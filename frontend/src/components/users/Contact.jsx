import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/topbar/TopBar";
import Footer from "../../components/footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../api";

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const resetFeedback = () => {
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!subject.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const body = {
        studentId: user?.student_id || user?.studentId,
        name: user?.displayName || `${user?.firstName} ${user?.lastName}`,
        email: user?.username,
        subject,
        message,
      };

      const res = await fetch(buildApiUrl("submitContactForm"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Failed to send message.");
      } else {
        setSuccess(
          "Your message has been sent successfully. You will be redirected to your messages shortly."
        );

        setSubject("");
        setMessage("");

        // Redirect to MessageList after 5 seconds
        setTimeout(() => {
          navigate("/messages");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />

      <main className="flex-1 flex justify-center items-start px-6 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-10">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-4xl text-indigo-600">
              support_agent
            </span>
            <h1 className="text-2xl font-semibold text-gray-800">
              Contact Administration
            </h1>
          </div>

          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            If you have questions, issues, or need assistance, send us a message
            below. Our administration team will get back to you as soon as
            possible.
          </p>

          {/* SUCCESS */}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 border border-green-300">
              {success}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 border border-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={
                  user?.displayName ||
                  `${user?.firstName} ${user?.lastName}`
                }
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-600 shadow-sm"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.username}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-600 shadow-sm"
              />
            </div>

            {/* SUBJECT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                placeholder="Ex: Issue with my grades..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition shadow-sm"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or issue..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition shadow-sm resize-none"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white text-sm font-semibold shadow-lg transition 
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
                }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
