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

const NAV_ITEMS = [
  { key: "Dashboard", icon: "⊞", label: "Overview" },
  { key: "Employers", icon: "💼", label: "Employers" },
  { key: "Members", icon: "👥", label: "Members" },
  { key: "Settings", icon: "✏️", label: "Settings" },
  { key: "Contacts", icon: "📩", label: "Contacts" }
];

const EMPTY_FORM = {
  name: "",
  title: "",
  description: "",
  mobile_no: "",
  country: "",
  state: "",
  city: "",
  street: "",
  house_no: "",
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
const card = {
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: 28,
  boxShadow: "0 1px 3px rgba(7,25,46,0.04)",
  maxWidth: 640,
};
const sectionLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: C.navy,
  marginBottom: 12,
  marginTop: 18,
};

function Field({ label, value, onChange, type = "text", required = false, placeholder = "" }) {
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

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/").pop();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const handleSetPage = (nextPage) => {
    navigate(`/${nextPage}`);
  };

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );
  const userName = user?.fullName?.name || "Admin";
  const logo = userName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/admin/settings`);
      const settings = res.data?.settings;
      if (settings) {
        setForm({
          name: settings.name || "",
          title: settings.title || "",
          description: settings.description || "",
          mobile_no: settings.mobile_no ?? "",
          country: settings.country || "",
          state: settings.state || "",
          city: settings.city || "",
          street: settings.street || "",
          house_no: settings.house_no || "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSavedMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedMessage("");

    try {
      const payload = { ...form, mobile_no: Number(form.mobile_no) };
      const res = await axios.put(`${API_BASE}/admin/settings`, payload);
      setForm((prev) => ({ ...prev, ...res.data?.settings }));
      setSavedMessage("Settings saved.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
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
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Admin</div>
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
                  borderLeft: active ? `3px solid ${C.blueAcc}` : "3px solid transparent",
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
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, fontFamily: "Georgia, serif" }}>
            Settings
          </div>
          <div style={{ fontSize: 12, color: C.gray }}>Update your project details</div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {error && (
            <div style={{ marginBottom: 18, padding: 14, borderRadius: 9, background: "#FEF2F2", color: C.red, maxWidth: 640 }}>
              {error}
            </div>
          )}
          {savedMessage && (
            <div style={{ marginBottom: 18, padding: 14, borderRadius: 9, background: C.greenBg, color: C.green, maxWidth: 640 }}>
              {savedMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={card}>
            <div style={sectionLabel}></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Project Name *" value={form.name} onChange={handleChange("name")} required />
              <Field label="Title" value={form.title} onChange={handleChange("title")} />
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <Field
                label="Mobile Number *"
                value={form.mobile_no}
                onChange={handleChange("mobile_no")}
                type="number"
                required
              />
            </div>

            <div style={sectionLabel}>Address</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Country *" value={form.country} onChange={handleChange("country")} required />
              <Field label="State *" value={form.state} onChange={handleChange("state")} required />
              <Field label="City *" value={form.city} onChange={handleChange("city")} required />
              <Field label="Street *" value={form.street} onChange={handleChange("street")} required />
              <Field label="House No. *" value={form.house_no} onChange={handleChange("house_no")} required />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button type="submit" disabled={saving} style={btnPrimary}>
                {saving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}