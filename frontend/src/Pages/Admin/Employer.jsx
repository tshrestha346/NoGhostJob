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
  green: "#16A34A",
  greenBg: "#ECFDF5",
};

const EMPTY_FORM = {
  name: "",
  industry: "",
  location: "",
  size: "",
  website: "",
  description: "",
  founded: "",
  logo: "",
  owner: "",
};

const NAV_ITEMS = [
  { key: "Dashboard", icon: "⊞", label: "Overview" },
  { key: "Employers", icon: "💼", label: "Employers" },
  { key: "Members", icon: "👥", label: "Members" },
  { key: "Settings", icon: "✏️", label: "Settings" },
];

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

function StatusBadge({ isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        background: isActive ? C.greenBg : "#FEF2F2",
        color: isActive ? C.green : C.red,
      }}
      title="Click to toggle status"
    >
      {isActive ? "Active" : "Inactive"}
    </button>
  );
}


function EmployerModal({ mode, initialData, onClose, onSaved }) {
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
      const payload = {
        ...form,
        founded: form.founded ? Number(form.founded) : null,
      };

      if (mode === "add") {
        await axios.post(`${API_BASE}/admin/employers`, payload);
      } else {
        // owner account fields don't exist/apply once the employer is created
        const { ownerFullName, ownerEmail, ownerPassword, ...updatePayload } =
          payload;
        await axios.put(
          `${API_BASE}/admin/employers/${initialData._id}`,
          updatePayload,
        );
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save employer.",
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
          {mode === "add" ? "Add New Employer" : "Edit Employer"}
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
            label="Company Name *"
            value={form.name}
            onChange={handleChange("name")}
            required
          />
          <Field
            label="Industry *"
            value={form.industry}
            onChange={handleChange("industry")}
            required
          />
          <Field
            label="Location *"
            value={form.location}
            onChange={handleChange("location")}
            required
          />
          <Field
            label="Size *"
            value={form.size}
            onChange={handleChange("size")}
            required
            placeholder="e.g. 51-200 employees"
          />
          <Field
            label="Website"
            value={form.website}
            onChange={handleChange("website")}
          />
          <Field
            label="Founded (year)"
            value={form.founded}
            onChange={handleChange("founded")}
            type="number"
          />
          <Field
            label="Logo URL"
            value={form.logo}
            onChange={handleChange("logo")}
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

          {mode === "add" && (
            <>
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 12,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.navy,
                    marginBottom: 10,
                  }}
                >
                  Owner Account
                </div>
              </div>
              <Field
                label="Full Name *"
                value={form.ownerFullName}
                onChange={handleChange("ownerFullName")}
                required
              />
              <Field
                label="Email *"
                value={form.ownerEmail}
                onChange={handleChange("ownerEmail")}
                type="email"
                required
              />
              <Field
                label="Password *"
                value={form.ownerPassword}
                onChange={handleChange("ownerPassword")}
                type="password"
                required
              />
            </>
          )}

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
                  ? "Add Employer"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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

export default function EmployersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/").pop();

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [editingEmployer, setEditingEmployer] = useState(null);

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

  const loadEmployers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/admin/employers`);
      const rows = res.data?.employers || res.data?.data || [];
      setEmployers(rows);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load employers.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  const openAdd = () => {
    setEditingEmployer(null);
    setModalMode("add");
  };

  const openEdit = (emp) => {
    setEditingEmployer({
      _id: emp._id,
      name: emp.name || "",
      industry: emp.industry || "",
      location: emp.location || "",
      size: emp.size || "",
      website: emp.website || "",
      description: emp.description || "",
      founded: emp.founded || "",
      logo: emp.logo || "",
    });
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingEmployer(null);
  };

  const toggleStatus = async (emp) => {
    // optimistic update
    setEmployers((prev) =>
      prev.map((e) =>
        e._id === emp._id ? { ...e, isActive: !e.isActive } : e,
      ),
    );
    try {
      await axios.patch(`${API_BASE}/admin/employers/${emp._id}/status`, {
        isActive: !emp.isActive,
      });
    } catch (err) {
      // revert on failure
      setEmployers((prev) =>
        prev.map((e) =>
          e._id === emp._id ? { ...e, isActive: emp.isActive } : e,
        ),
      );
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFF]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

          <p className="mt-4 font-semibold text-[#3D4A63]">
            Loading...
          </p>
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
            position: "sticky",
            top: 0,
            zIndex: 20,
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
              Employers
            </div>
            <div style={{ fontSize: 12, color: C.gray }}>
              Manage employer accounts
            </div>
          </div>
          <button onClick={openAdd} style={btnPrimary}>
            + Add New
          </button>
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
                    <th style={th}>Company</th>
                    <th style={th}>Website</th>
                    <th style={th}>Email</th>
                    <th style={th}>Industry</th>
                    <th style={th}>Location</th>
                    <th style={th}>Jobs</th>
                    <th style={th}></th>
                  </tr>
                </thead>
                <tbody>
                  {employers.length === 0 ? (
                    <tr>
                      <td
                        style={{ ...td, textAlign: "center", color: C.gray }}
                        colSpan={7}
                      >
                        No employers found.
                      </td>
                    </tr>
                  ) : (
                    employers.map((emp) => (
                      <tr key={emp._id}>
                        <td style={{ ...td, fontWeight: 600 }}>{emp.name}</td>
                        <td style={td}>{emp.website || "—"}</td>
                        <td style={td}>{emp.email || "—"}</td>
                        <td style={td}>{emp.industry}</td>
                        <td style={td}>{emp.location}</td>
                        <td style={td}>{emp.jobsCount ?? 0}</td>
                        <td style={td}>
                          <button
                            onClick={() => openEdit(emp)}
                            style={{
                              border: "none",
                              background: "none",
                              color: C.blue,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
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
        <EmployerModal
          mode={modalMode}
          initialData={modalMode === "edit" ? editingEmployer : null}
          onClose={closeModal}
          onSaved={loadEmployers}
        />
      )}
    </div>
  );
}
