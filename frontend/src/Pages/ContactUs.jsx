import { useState } from "react";

const colors = {
  navy: "#0A2540",
  blue: "#1565C0",
  blueMid: "#1976D2",
  blueLight: "#42A5F5",
  bluePale: "#E3F2FD",
  blueSoft: "#BBDEFB",
  white: "#FFFFFF",
  offWhite: "#F7FAFF",
  gray: "#6B7A99",
  grayLight: "#EEF2F7",
  grayDark: "#3D4A63",
  border: "#DDEAFC",
};

const teamMembers = [
  {
    name: "Alexandra Morgan",
    title: "Chief Executive Officer",
    initials: "AM",
    bio: "20+ years leading enterprise technology firms across North America and Europe.",
  },
  {
    name: "David Chen",
    title: "Chief Technology Officer",
    initials: "DC",
    bio: "Former Google engineer. Architect of our core infrastructure and product roadmap.",
  },
  {
    name: "Priya Nair",
    title: "Head of Design",
    initials: "PN",
    bio: "Award-winning designer with a passion for human-centered product experiences.",
  },
  {
    name: "Marcus Williams",
    title: "VP of Operations",
    initials: "MW",
    bio: "Operational strategist ensuring seamless delivery for 200+ enterprise clients.",
  },
];

const stats = [
  { value: "12+", label: "Years of Excellence" },
  { value: "200+", label: "Enterprise Clients" },
  { value: "98%", label: "Client Retention" },
  { value: "40+", label: "Countries Served" },
];

const values = [
  {
    icon: "⬡",
    title: "Integrity First",
    desc: "We hold ourselves to the highest ethical standards in every engagement.",
  },
  {
    icon: "◈",
    title: "Innovation-Driven",
    desc: "Constant reinvention keeps our clients ahead in rapidly changing markets.",
  },
  {
    icon: "◎",
    title: "Client-Centric",
    desc: "Every decision is guided by the measurable outcomes we deliver for clients.",
  },
  {
    icon: "⬟",
    title: "Global Perspective",
    desc: "Diverse teams. Inclusive solutions. A truly worldwide footprint.",
  },
];

const offices = [
  { city: "New York", address: "350 Fifth Avenue, Suite 4200", country: "USA" },
  { city: "London", address: "30 St Mary Axe, Level 12", country: "UK" },
  { city: "Singapore", address: "1 Raffles Place, Tower 2", country: "SG" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const inputStyle = (field) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: `1.5px solid ${focused === field ? colors.blueMid : colors.border}`,
    background: focused === field ? colors.white : colors.offWhite,
    fontSize: "14px",
    color: colors.navy,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
  });

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: colors.grayDark,
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    marginBottom: "7px",
  };

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSubmitted(true);
  };

  return (
    <div style={{ background: colors.white, minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(150deg, ${colors.navy} 0%, #0D3A6E 60%, #1565C0 100%)`,
          padding: "72px 48px 68px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "rgba(66,165,245,0.15)",
            border: "1px solid rgba(66,165,245,0.3)",
            color: colors.blueLight,
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            padding: "5px 16px",
            borderRadius: "20px",
            marginBottom: "20px",
          }}
        >
          Get in Touch
        </span>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "48px",
            fontWeight: 700,
            color: colors.white,
            margin: "0 0 16px",
            letterSpacing: "-1px",
            lineHeight: 1.15,
          }}
        >
          Let's Start a Conversation
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "16px",
            lineHeight: 1.75,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          Whether you're exploring a new initiative or ready to engage, our team responds within
          one business day.
        </p>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "72px 48px",
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: "56px",
        }}
      >
        {/* Left sidebar */}
        <div>
          <h3
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "22px",
              fontWeight: 700,
              color: colors.navy,
              margin: "0 0 28px",
            }}
          >
            Contact Information
          </h3>

          {[
            { icon: "✉", label: "General Inquiries", val: "hello@nexvara.com" },
            { icon: "✉", label: "Business Development", val: "partners@nexvara.com" },
            { icon: "☏", label: "Global Headquarters", val: "+1 (212) 555-0190" },
            { icon: "☏", label: "Support Hotline", val: "+1 (800) 555-0444" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "14px",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: i < 3 ? `1px solid ${colors.border}` : "none",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: colors.bluePale,
                  border: `1px solid ${colors.blueSoft}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  color: colors.blue,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: colors.gray,
                    marginBottom: "3px",
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: "14px", color: colors.navy, fontWeight: 500 }}>
                  {item.val}
                </div>
              </div>
            </div>
          ))}

          {/* Offices */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.navy} 0%, #1A4A8A 100%)`,
              borderRadius: "12px",
              padding: "24px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: colors.blueLight,
                marginBottom: "16px",
              }}
            >
              Global Offices
            </div>
            {offices.map((o, i) => (
              <div
                key={i}
                style={{
                  marginBottom: i < 2 ? "16px" : 0,
                  paddingBottom: i < 2 ? "16px" : 0,
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3px",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600, color: colors.white }}>
                    {o.city}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      background: "rgba(66,165,245,0.2)",
                      border: "1px solid rgba(66,165,245,0.3)",
                      color: colors.blueLight,
                      padding: "2px 7px",
                      borderRadius: "4px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {o.country}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                  {o.address}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: "16px",
            padding: "40px 36px",
            boxShadow: "0 4px 40px rgba(21,101,192,0.07)",
          }}
        >
          {submitted ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: colors.bluePale,
                  border: `2px solid ${colors.blueSoft}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  color: colors.blue,
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "26px",
                  color: colors.navy,
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                Message Received
              </h3>
              <p style={{ color: colors.gray, fontSize: "15px", lineHeight: 1.7, margin: 0 }}>
                Thank you, <strong>{form.name}</strong>. A member of our team will be in touch
                within one business day.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", subject: "", message: "" }); }}
                style={{
                  marginTop: "8px",
                  padding: "10px 28px",
                  background: colors.blueMid,
                  color: colors.white,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h3
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: colors.navy,
                  margin: "0 0 28px",
                }}
              >
                Send Us a Message
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("name")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("email")}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    onFocus={() => setFocused("company")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("company")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    onFocus={() => setFocused("subject")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("subject")}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  placeholder="Tell us about your project, goals, or any questions you have..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  rows={5}
                  style={{ ...inputStyle("message"), resize: "vertical", lineHeight: 1.6 }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: colors.gray }}>* Required fields</span>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "12px 32px",
                    background: `linear-gradient(135deg, ${colors.blueMid} 0%, ${colors.navy} 100%)`,
                    color: colors.white,
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "0.3px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Submit Message →
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section
        style={{
          background: colors.bluePale,
          borderTop: `1px solid ${colors.blueSoft}`,
          padding: "36px 48px",
          textAlign: "center",
        }}
      >
        <p style={{ color: colors.gray, fontSize: "14px", margin: 0 }}>
          Prefer a direct conversation?{" "}
          <span style={{ color: colors.blueMid, fontWeight: 600, cursor: "pointer" }}>
            Schedule a 30-minute discovery call
          </span>{" "}
          with one of our solutions consultants.
        </p>
      </section>
    </div>
  );
}