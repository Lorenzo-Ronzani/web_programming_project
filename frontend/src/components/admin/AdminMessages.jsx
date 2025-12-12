import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../api";

const AdminMessages = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  // --------------------------------------------------
  // Load messages
  // --------------------------------------------------
  const fetchMessages = async () => {
    try {
      const res = await fetch(buildApiUrl("getAllMessages"));
      const json = await res.json();

      if (json.success && Array.isArray(json.items)) {
        setMessages(json.items);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Open modal
  // --------------------------------------------------
  const openMessage = (message) => {
    setSelectedMessage(message);
    setReply(message.reply || ""); // ✅ sincroniza reply
  };

  // --------------------------------------------------
  // Mark as answered
  // --------------------------------------------------
  const markAsAnswered = async () => {
    if (!selectedMessage) return;

    try {
      setSaving(true);

      await fetch(buildApiUrl("updateMessageStatus"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          reply: reply.trim(),
        }),
      });

      // Atualiza estado local corretamente
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? {
                ...m,
                status: "answered",
                reply: reply.trim(),
              }
            : m
        )
      );

      closeModal();
    } catch (err) {
      console.error("Failed to update message", err);
      alert("Failed to mark message as answered.");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setReply("");
  };

  // --------------------------------------------------
  // Status badge
  // --------------------------------------------------
  const renderStatus = (status) =>
    status === "answered" ? (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
        Answered
      </span>
    ) : (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
        Unread
      </span>
    );

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Support Messages</h1>
          <p className="text-sm text-gray-500">Messages sent by students</p>
        </div>

        <button
          onClick={() => navigate("/dashboardadmin")}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No messages found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b">
                <th className="p-3 text-left text-sm font-medium">Student</th>
                <th className="p-3 text-left text-sm font-medium">Subject</th>
                <th className="p-3 text-left text-sm font-medium">Status</th>
                <th className="p-3 text-left text-sm font-medium">Date</th>
                <th className="p-3 text-left text-sm font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((m) => (
                <tr
                  key={m.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-sm">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-500">
                      {m.studentId}
                    </div>
                  </td>

                  <td className="p-3 text-sm">{m.subject}</td>
                  <td className="p-3">{renderStatus(m.status)}</td>

                  <td className="p-3 text-sm text-gray-600">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => openMessage(m)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              {selectedMessage.subject}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              From {selectedMessage.name} ({selectedMessage.studentId})
            </p>

            <div className="border rounded p-4 text-sm mb-4 bg-gray-50">
              {selectedMessage.message}
            </div>

            <label className="block text-sm font-medium mb-1">Reply</label>
            <textarea
              className="w-full border rounded p-3 text-sm mb-4"
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply here..."
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded bg-gray-100"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={markAsAnswered}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Save & Mark as Answered
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
