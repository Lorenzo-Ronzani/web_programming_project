import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../topbar/TopBar";
import Footer from "../footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { buildApiUrl } from "../../api";

const PAGE_SIZE = 5;

const MessageList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentId = user?.student_id || user?.studentId || "";

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all"); // all | unread | answered
  const [fromDate, setFromDate] = useState(""); // YYYY-MM-DD
  const [toDate, setToDate] = useState(""); // YYYY-MM-DD

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IMPORTANT: buildApiUrl MUST receive only the function name
  // and querystring must be appended outside.
  const loadMessages = async () => {
    setLoading(true);
    try {
      if (!studentId) {
        setMessages([]);
        return;
      }

      const url = buildApiUrl("getStudentMessages") + `?studentId=${studentId}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.success && Array.isArray(json.items)) {
        setMessages(json.items);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Date helpers (no timezone headaches) ----------
  const toYMD = (value) => {
    if (!value) return "";
    // If Firestore stored ISO string, best case:
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
    // Fallback:
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

  // ---------- Filtering ----------
  const filteredMessages = useMemo(() => {
    const from = fromDate || "";
    const to = toDate || "";

    return (messages || []).filter((m) => {
      // status
      if (statusFilter !== "all" && m.status !== statusFilter) return false;

      // date range (compare YYYY-MM-DD strings)
      const created = toYMD(m.createdAt);
      if (!created) return true; // if missing date, don't block

      if (from && created < from) return false;
      if (to && created > to) return false;

      return true;
    });
  }, [messages, statusFilter, fromDate, toDate]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, fromDate, toDate]);

  // ---------- Pagination ----------
  const totalItems = filteredMessages.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const pagedMessages = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredMessages.slice(start, start + PAGE_SIZE);
  }, [filteredMessages, safePage]);

  // ---------- Quick filters ----------
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

  return (
    <>
      <TopBar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold">My Messages</h1>
            <p className="text-sm text-gray-500">
              Messages you sent to the administration
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboarduser")}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">All statuses</option>
              <option value="unread">Pending</option>
              <option value="answered">Answered</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={clearFilters}
              className="ml-auto px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Clear filters
            </button>
          </div>

          {/* QUICK FILTERS */}
          <div className="flex flex-wrap gap-2 mt-3">
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
              Pending only
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Loading messages...</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">
              No messages found for the selected filters.
            </p>
          </div>
        ) : (
          <>
            {/* LIST */}
            <div className="space-y-4">
              {pagedMessages.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{m.subject}</h3>
                      <p className="text-xs text-gray-500">
                        Sent on {formatDT(m.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        m.status === "answered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {m.status === "answered" ? "Answered" : "Pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
                    {m.message}
                  </p>

                  {m.reply && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="text-xs font-semibold text-blue-700 mb-1">
                        Admin reply
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {m.reply}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Answered on {formatDT(m.answeredAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-gray-500">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, totalItems)} of {totalItems}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    safePage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Prev
                </button>

                <span className="text-sm text-gray-600">
                  Page {safePage} / {totalPages}
                </span>

                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    safePage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MessageList;
