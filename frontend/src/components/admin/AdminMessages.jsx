import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../api";

const PAGE_SIZE = 8;

const AdminMessages = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all"); // all | unread | answered
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, []);

  // --------------------------------------------------
  // Load messages
  // --------------------------------------------------
  const fetchMessages = async () => {
    setLoading(true);
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
  // Date helpers (same as student)
  // --------------------------------------------------
  const toYMD = (value) => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const formatDT = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------
  const filteredMessages = useMemo(() => {
    const from = fromDate || "";
    const to = toDate || "";

    return (messages || []).filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;

      const created = toYMD(m.createdAt);
      if (!created) return true;

      if (from && created < from) return false;
      if (to && created > to) return false;

      return true;
    });
  }, [messages, statusFilter, fromDate, toDate]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, fromDate, toDate]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------
  const totalItems = filteredMessages.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const pagedMessages = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredMessages.slice(start, start + PAGE_SIZE);
  }, [filteredMessages, safePage]);

  // --------------------------------------------------
  // Quick filters
  // --------------------------------------------------
  const applyLast7Days = () => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - 7);

    setFromDate(past.toISOString().slice(0, 10));
    setToDate(today.toISOString().slice(0, 10));
  };

  const applyThisMonth = () => {
    const today = new Date();
    const first = new Date(today.getFullYear(), today.getMonth(), 1);

    setFromDate(first.toISOString().slice(0, 10));
    setToDate(today.toISOString().slice(0, 10));
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
  };

  // --------------------------------------------------
  // Modal actions
  // --------------------------------------------------
  const openMessage = (message) => {
    setSelectedMessage(message);
    setReply(message.reply || "");
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setReply("");
  };

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

      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? { ...m, status: "answered", reply: reply.trim() }
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

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="unread">Unread</option>
            <option value="answered">Answered</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={clearFilters}
            className="ml-auto px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Clear filters
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={applyLast7Days}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Last 7 days
          </button>

          <button
            onClick={applyThisMonth}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            This month
          </button>

          <button
            onClick={() => setStatusFilter("unread")}
            className="px-3 py-1.5 text-xs rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          >
            Unread only
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading messages...</p>
        ) : totalItems === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No messages found for the selected filters.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm">
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedMessages.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.studentId}</div>
                  </td>
                  <td className="p-3 text-sm">{m.subject}</td>
                  <td className="p-3">{renderStatus(m.status)}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatDT(m.createdAt)}
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

      {/* PAGINATION */}
      {!loading && totalItems > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-500">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, totalItems)} of {totalItems}
          </span>

          <div className="flex gap-2">
            <button
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
