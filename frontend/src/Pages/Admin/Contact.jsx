import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const C = {
  navy: "#07192E",
  blue: "#1565C0",
  blueAcc: "#2196F3",
  white: "#FFFFFF",
  offWhite: "#F7FAFF",
  border: "#DDEAFC",
  gray: "#6B7A99",
  red: "#DC2626",
};

const NAV_ITEMS = [
  { key: "Dashboard", icon: "⊞", label: "Overview" },
  { key: "Employers", icon: "💼", label: "Employers" },
  { key: "Members", icon: "👥", label: "Members" },
  { key: "Settings", icon: "✏️", label: "Settings" },
  { key: "Contacts", icon: "📩", label: "Contacts" }
];

const EMPTY_FORM = {
  title: "",
  full_name: "",
  designation: "",
  description: "",
  image: "",
};

const th = {
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  color: C.gray,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  padding: "10px 16px",
  borderBottom: `1px solid ${C.border}`,
};
const td = {
  padding: "12px 16px",
  fontSize: 13,
  color: C.navy,
  borderBottom: `1px solid ${C.border}`,
};
const tableWrap = {
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(7,25,46,0.04)",
};
const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: C.gray,
  marginBottom: 4,
};
const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  fontSize: 13,
  color: C.navy,
  boxSizing: "border-box",
  fontFamily: "inherit",
};
const btnPrimary = {
  padding: "9px 18px",
  borderRadius: 8,
  border: "none",
  background: `linear-gradient(135deg,${C.blue},${C.blueAcc})`,
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
const btnSecondary = {
  padding: "9px 18px",
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  background: C.white,
  color: C.navy,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function MemberModal({ mode, initialData, onClose, onSaved }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (mode === "add") {
        await axios.post(`${API_BASE}/admin/members`, form);
      } else {
        await axios.put(`${API_BASE}/admin/members/${initialData._id}`, form);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save member.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,25,46,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white,
          borderRadius: 14,
          padding: 28,
          width: 480,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(7,25,46,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.navy,
            marginBottom: 18,
            fontFamily: "Georgia, serif",
          }}
        >
          {mode === "add" ? "Add New Member" : "Edit Member"}
        </div>

        {error && (
          <div
            style={{
              marginBottom: 14,
              padding: 10,
              borderRadius: 8,
              background: "#FEF2F2",
              color: C.red,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <Field
            label="Full Name *"
            value={form.full_name}
            onChange={handleChange("full_name")}
            required
          />
          <Field
            label="Title"
            value={form.title}
            onChange={handleChange("title")}
          />
          <Field
            label="Designation"
            value={form.designation}
            onChange={handleChange("designation")}
          />
          <Field
            label="Image URL"
            value={form.image}
            onChange={handleChange("image")}
          />
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <button type="button" onClick={onClose} style={btnSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={btnPrimary}>
              {saving
                ? "Saving…"
                : mode === "add"
                  ? "Add Member"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MembersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/").pop();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [editingMember, setEditingMember] = useState(null);

  const handleSetPage = (nextPage) => {
    navigate(`/${nextPage}`);
  };

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );
  const userName = user?.fullName?.name || "Admin";
  const logo = userName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const loadMessages = async () => {
    try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/admin/contacts`);

        setMessages(res.data.messages);

    } catch (err) {
        setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load contact messages."
        );
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    loadMessages();
  }, []);
  console.log('contact',messages)
  const openAdd = () => {
    setEditingMember(null);
    setModalMode("add");
  };

  const openEdit = (member) => {
    setEditingMember({
      _id: member._id,
      title: member.title || "",
      full_name: member.full_name || "",
      designation: member.designation || "",
      description: member.description || "",
      image: member.image || "",
    });
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingMember(null);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete ${member.full_name}? This can't be undone.`))
      return;

    const previous = members;
    setMembers((prev) => prev.filter((m) => m._id !== member._id));

    try {
      await axios.delete(`${API_BASE}/admin/members/${member._id}`);
    } catch (err) {
      setMembers(previous); // revert on failure
      setError(err.response?.data?.message || "Failed to delete member.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFF]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

          <p className="mt-4 font-semibold text-[#3D4A63]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.offWhite,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        display: "flex",
      }}
    >
      <aside
        style={{
          width: 230,
          background: C.navy,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "linear-gradient(135deg,#42A5F5,#1565C0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {logo}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              Admin
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleSetPage(item.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 9,
                  border: "none",
                  background: active ? "rgba(66,165,245,0.18)" : "transparent",
                  color: active ? "#90CAF9" : "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer",
                  marginBottom: 2,
                  textAlign: "left",
                  borderLeft: active
                    ? `3px solid ${C.blueAcc}`
                    : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            background: C.white,
            borderBottom: `1px solid ${C.border}`,
            padding: "16px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.navy,
                fontFamily: "Georgia, serif",
              }}
            >
              Members
            </div>
            <div style={{ fontSize: 12, color: C.gray }}>
              Manage team/member profiles
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {error && (
            <div
              style={{
                marginBottom: 18,
                padding: 14,
                borderRadius: 9,
                background: "#FEF2F2",
                color: C.red,
              }}
            >
              {error}
            </div>
          )}

          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Company</th>
                  <th style={th}>Subject</th>
                  <th style={th}>Status</th>
                  <th style={th}>Message</th>
                  <th style={th}>Received</th>
                </tr>
              </thead>

              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ ...td, textAlign: "center", color: C.gray }}
                    >
                      No contact messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg._id}>
                      <td style={{ ...td, fontWeight: 600 }}>{msg.name}</td>

                      <td style={td}>{msg.email}</td>

                      <td style={td}>{msg.company || "-"}</td>

                      <td style={td}>{msg.subject || "-"}</td>

                      <td style={td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              msg.status === "new"
                                ? "#DBEAFE"
                                : msg.status === "read"
                                  ? "#FEF3C7"
                                  : "#DCFCE7",
                            color:
                              msg.status === "new"
                                ? "#1D4ED8"
                                : msg.status === "read"
                                  ? "#92400E"
                                  : "#166534",
                          }}
                        >
                          {msg.status}
                        </span>
                      </td>

                      <td style={{ ...td, maxWidth: 300 }}>
                        {msg.message.length > 80
                          ? msg.message.substring(0, 80) + "..."
                          : msg.message}
                      </td>

                      <td style={td}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modalMode && (
        <MemberModal
          mode={modalMode}
          initialData={modalMode === "edit" ? editingMember : null}
          onClose={closeModal}
          onSaved={loadMembers}
        />
      )}
    </div>
  );
}
