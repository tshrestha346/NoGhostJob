import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  navy:     "#07192E",
  navyMid:  "#0D2B4A",
  blue:     "#1565C0",
  blueMid:  "#1976D2",
  blueAcc:  "#2196F3",
  bluePale: "#E3F2FD",
  blueSoft: "#BBDEFB",
  white:    "#FFFFFF",
  offWhite: "#F7FAFF",
  border:   "#DDEAFC",
  gray:     "#6B7A99",
  grayLight:"#EEF2F7",
  grayDark: "#3D4A63",
  error:    "#DC2626",
  errorPale:"#FEF2F2",
  errorBd:  "#FECACA",
  green:    "#15803D",
  greenPale:"#DCFCE7",
};

// ─── FLOATING LABEL INPUT ─────────────────────────────────────────────────────
function AuthInput({ label, name, type = "text", value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const active = focused || value.length > 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ position: "relative" }}>
        {/* Floating label */}
        <label style={{
          position: "absolute",
          left: "14px",
          top: active ? "7px" : "50%",
          transform: active ? "translateY(0) scale(0.82)" : "translateY(-50%)",
          transformOrigin: "left",
          fontSize: active ? "11px" : "14px",
          fontWeight: active ? 700 : 400,
          color: focused ? C.blue : error ? C.error : C.gray,
          letterSpacing: active ? "0.4px" : "0",
          textTransform: active ? "uppercase" : "none",
          transition: "all 0.18s ease",
          pointerEvents: "none",
          zIndex: 2,
          background: active ? C.white : "transparent",
          padding: active ? "0 2px" : "0",
        }}>{label}</label>

        <input
          name={name}
          type={isPassword ? (showPwd ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: active ? "22px 44px 8px 14px" : "15px 44px 15px 14px",
            borderRadius: "10px",
            border: `1.5px solid ${error ? C.error : focused ? C.blueAcc : C.border}`,
            background: error ? C.errorPale : focused ? C.white : C.offWhite,
            fontSize: "14px",
            color: C.navy,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            transition: "all 0.18s ease",
            boxShadow: focused ? `0 0 0 3px ${C.bluePale}` : "none",
          }}
        />

        {/* Right icon */}
        <div style={{
          position: "absolute", right: "13px", top: "50%",
          transform: "translateY(-50%)",
          display: "flex", alignItems: "center",
        }}>
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "16px", color: C.gray, padding: "2px",
                lineHeight: 1,
              }}
            >{showPwd ? "🙈" : "👁️"}</button>
          ) : error ? (
            <span style={{ color: C.error, fontSize: "16px" }}>⚠</span>
          ) : value && !error ? (
            <span style={{ color: C.green, fontSize: "14px" }}>✓</span>
          ) : null}
        </div>
      </div>

      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: "5px",
          marginTop: "6px", padding: "5px 10px",
          borderRadius: "6px", background: C.errorPale,
          border: `1px solid ${C.errorBd}`,
        }}>
          <span style={{ fontSize: "12px", color: C.error }}>⚠</span>
          <span style={{ fontSize: "12px", color: C.error, fontWeight: 500 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

// ─── SOCIAL BUTTON ────────────────────────────────────────────────────────────
function SocialBtn({ icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: "8px", padding: "11px 0", borderRadius: "10px",
        border: `1.5px solid ${hov ? C.blueAcc : C.border}`,
        background: hov ? C.bluePale : C.white,
        color: C.grayDark, fontSize: "13px", fontWeight: 600,
        cursor: "pointer", transition: "all 0.18s",
        fontFamily: "inherit",
      }}
    >
      <span style={{ fontSize: "17px" }}>{icon}</span>
      {label}
    </button>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export default function Login() {
  const [form,    setForm]    = useState({ email: "", password: "", remember: false });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value, checked, type } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1400);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(150deg, ${C.navy} 0%, #0D2B4A 55%, #1565C0 100%)`,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 48px 40px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative rings */}
        {[440, 300, 180].map((sz, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${sz}px`, height: `${sz}px`,
            borderRadius: "50%",
            border: `1px solid rgba(66,165,245,${0.05 + i * 0.05})`,
            bottom: `${-sz / 2 + i * 20}px`,
            right: `${-sz / 2 + i * 20}px`,
          }} />
        ))}
        <div style={{
          position: "absolute", width: "280px", height: "280px",
          borderRadius: "50%", background: "rgba(33,150,243,0.12)",
          filter: "blur(70px)", top: "-60px", left: "-60px",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 2 }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "9px",
            background: "linear-gradient(135deg, #42A5F5, #1565C0)",
            border: "1.5px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: 800, color: "#fff",
          }}>C</div>
          <span style={{ color: "#fff", fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            CareerHub
          </span>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "18px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "rgba(66,165,245,0.15)",
              border: "1px solid rgba(66,165,245,0.3)",
              color: "#90CAF9", fontSize: "11px", fontWeight: 700,
              letterSpacing: "1.2px", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: "20px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#42A5F5", display: "inline-block" }} />
              4,800+ Companies Hiring
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 700, color: "#fff",
            lineHeight: 1.18, letterSpacing: "-0.8px",
            margin: "0 0 16px",
          }}>
            Your next great
            <br />
            <span style={{ background: "linear-gradient(90deg, #42A5F5, #90CAF9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              career move
            </span>
            {" "}starts here.
          </h2>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.75, marginBottom: "36px" }}>
            Access 25,000+ verified jobs from the world's top companies. Your next opportunity is one login away.
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              ["25K+", "Active Jobs",         "💼"],
              ["4.8K+","Top Companies",        "🏢"],
              ["120K+","Registered Candidates","🎓"],
              ["18K+", "Successful Hires",     "📈"],
            ].map(([v, l, icon]) => (
              <div key={l} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px", padding: "16px",
              }}>
                <div style={{ fontSize: "11px", marginBottom: "4px" }}>{icon}</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: "'Georgia', serif" }}>{v}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "3px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{
          position: "relative", zIndex: 2,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px", padding: "20px",
        }}>
          <div style={{ display: "flex", gap: "3px", marginBottom: "10px" }}>
            {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: "13px" }}>{s}</span>)}
          </div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", lineHeight: 1.7, margin: "0 0 12px", fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
            "Landed my dream role at Google within 3 weeks of signing up. The job matching is genuinely impressive."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "rgba(66,165,245,0.3)", border: "1.5px solid rgba(66,165,245,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 800, color: "#90CAF9",
            }}>SJ</div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>Sarah Johnson</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Senior Developer · Google</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
      <div style={{
        background: C.white,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "48px 64px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {success ? (
            /* ── SUCCESS STATE ──────────────────────────────────── */
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: C.greenPale, border: `2px solid #BBF7D0`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px", margin: "0 auto 20px",
              }}>✓</div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "28px", fontWeight: 700, color: C.navy, margin: "0 0 10px" }}>
                Welcome back!
              </h2>
              <p style={{ color: C.gray, fontSize: "14px", lineHeight: 1.7 }}>
                Login successful. Redirecting you to your dashboard…
              </p>
              <div style={{
                marginTop: "24px", height: "3px", borderRadius: "3px",
                background: C.border, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: "3px",
                  background: `linear-gradient(90deg, ${C.blue}, ${C.blueAcc})`,
                  animation: "progress 1.4s ease forwards",
                  width: "100%",
                }} />
              </div>
              <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: "32px" }}>
                <h1 style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "30px", fontWeight: 700,
                  color: C.navy, margin: "0 0 8px",
                  letterSpacing: "-0.5px",
                }}>Welcome back</h1>
                <p style={{ color: C.gray, fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  Log in to continue your job search and access your saved roles.
                </p>
              </div>

              {/* Social buttons */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                <SocialBtn icon="🔵" label="Google" />
                <SocialBtn icon="🔗" label="LinkedIn" />
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
                <span style={{ fontSize: "12px", color: C.gray, fontWeight: 600, whiteSpace: "nowrap" }}>or continue with email</span>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <AuthInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <AuthInput
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                />

                {/* Remember + Forgot */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <div
                      onClick={() => setForm(f => ({ ...f, remember: !f.remember }))}
                      style={{
                        width: "17px", height: "17px", borderRadius: "4px",
                        border: `2px solid ${form.remember ? C.blue : C.border}`,
                        background: form.remember ? C.blue : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {form.remember && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "13px", color: C.grayDark, fontWeight: 500 }}>Remember me</span>
                  </label>
                  <a href="#" style={{ fontSize: "13px", color: C.blue, fontWeight: 600, textDecoration: "none" }}>
                    Forgot password?
                  </a>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: "14px 0",
                    borderRadius: "10px", border: "none",
                    background: loading
                      ? C.blueSoft
                      : `linear-gradient(135deg, ${C.blue} 0%, ${C.blueAcc} 100%)`,
                    color: loading ? C.blue : "#fff",
                    fontSize: "15px", fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.2px",
                    boxShadow: loading ? "none" : "0 6px 22px rgba(21,101,192,0.3)",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    fontFamily: "inherit",
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: "16px", height: "16px", borderRadius: "50%",
                        border: `2px solid ${C.blueSoft}`,
                        borderTopColor: C.blue,
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                      Logging in…
                    </>
                  ) : "Log In →"}
                </button>
              </form>

              {/* Register link */}
              <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: C.gray }}>
                Don't have an account?{" "}
                <a href="#" style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}>
                  Create one free
                </a>
              </p>

              {/* Trust row */}
              <div style={{
                marginTop: "32px",
                borderTop: `1px solid ${C.border}`,
                paddingTop: "20px",
                display: "flex", justifyContent: "center", gap: "20px",
              }}>
                {["🔒 Secure login", "✅ Verified employers", "🚀 Free forever"].map(item => (
                  <span key={item} style={{ fontSize: "11px", color: C.gray, fontWeight: 500 }}>{item}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}