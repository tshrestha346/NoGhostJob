import { useState, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  navy:      "#07192E",
  navyMid:   "#0D2B4A",
  blue:      "#1565C0",
  blueMid:   "#1976D2",
  blueAcc:   "#2196F3",
  bluePale:  "#E3F2FD",
  blueSoft:  "#BBDEFB",
  white:     "#FFFFFF",
  offWhite:  "#F7FAFF",
  border:    "#DDEAFC",
  gray:      "#6B7A99",
  grayLight: "#EEF2F7",
  grayDark:  "#3D4A63",
  error:     "#DC2626",
  errorPale: "#FEF2F2",
  errorBd:   "#FECACA",
  green:     "#15803D",
  greenPale: "#DCFCE7",
  greenBd:   "#BBF7D0",
  amber:     "#B45309",
  amberPale: "#FEF3C7",
};

// ─── PASSWORD STRENGTH ───────────────────────────────────────────────────────
function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)            score++;
  if (/[A-Z]/.test(pwd))          score++;
  if (/[0-9]/.test(pwd))          score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;
  return score; // 0–4
}
const STRENGTH_META = [
  { label: "Too short",  color: C.error,  bg: "#FEE2E2" },
  { label: "Weak",       color: C.error,  bg: "#FEE2E2" },
  { label: "Fair",       color: C.amber,  bg: C.amberPale },
  { label: "Good",       color: "#0D9488",bg: "#CCFBF1" },
  { label: "Strong 🔒",  color: C.green,  bg: C.greenPale },
];

// ─── FLOATING LABEL INPUT ────────────────────────────────────────────────────
function AuthInput({ label, name, type = "text", value, onChange, error, hint }) {
  const [focused,  setFocused]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const isPassword = type === "password";
  const active     = focused || value.length > 0;

  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ position: "relative" }}>
        {/* Floating label */}
        <label style={{
          position: "absolute",
          left: "14px",
          top:       active ? "7px" : "50%",
          transform: active ? "translateY(0) scale(0.8)" : "translateY(-50%)",
          transformOrigin: "left",
          fontSize:  active ? "11px" : "14px",
          fontWeight: active ? 700 : 400,
          color: focused ? C.blue : error ? C.error : C.gray,
          letterSpacing: active ? "0.5px" : "0",
          textTransform: active ? "uppercase" : "none",
          transition: "all 0.17s ease",
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
          autoComplete={isPassword ? "new-password" : "off"}
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
            transition: "all 0.17s ease",
            boxShadow: focused ? `0 0 0 3px ${C.bluePale}` : "none",
          }}
        />

        {/* Right icon */}
        <div style={{
          position: "absolute", right: "13px", top: "50%",
          transform: "translateY(-50%)", display: "flex", alignItems: "center",
        }}>
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPwd(s => !s)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: C.gray, padding: "2px", lineHeight: 1 }}
            >{showPwd ? "🙈" : "👁️"}</button>
          ) : error ? (
            <span style={{ color: C.error, fontSize: "15px" }}>⚠</span>
          ) : value && !error ? (
            <span style={{ color: C.green, fontSize: "14px", fontWeight: 700 }}>✓</span>
          ) : null}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: "5px",
          marginTop: "5px", padding: "5px 10px",
          borderRadius: "6px", background: C.errorPale, border: `1px solid ${C.errorBd}`,
        }}>
          <span style={{ fontSize: "11px", color: C.error }}>⚠</span>
          <span style={{ fontSize: "12px", color: C.error, fontWeight: 500 }}>{error}</span>
        </div>
      )}

      {/* Hint (no error) */}
      {hint && !error && (
        <div style={{ marginTop: "5px", fontSize: "11px", color: C.gray, paddingLeft: "2px" }}>{hint}</div>
      )}
    </div>
  );
}

// ─── PASSWORD STRENGTH METER ──────────────────────────────────────────────────
function StrengthMeter({ password }) {
  const score = useMemo(() => getStrength(password), [password]);
  if (!password) return null;
  const meta = STRENGTH_META[score];
  return (
    <div style={{ marginBottom: "18px", marginTop: "-10px" }}>
      <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: "4px", borderRadius: "4px",
            background: i < score ? meta.color : C.border,
            transition: "background 0.25s ease",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, color: meta.color,
          background: meta.bg, padding: "2px 8px", borderRadius: "20px",
        }}>{meta.label}</span>
      </div>
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
        cursor: "pointer", transition: "all 0.17s", fontFamily: "inherit",
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span> {label}
    </button>
  );
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
function StepDot({ n, active, done }) {
  return (
    <div style={{
      width: "28px", height: "28px", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "12px", fontWeight: 700,
      background: done ? C.green : active ? C.blue : C.grayLight,
      color: (done || active) ? "#fff" : C.gray,
      border: `2px solid ${done ? C.green : active ? C.blue : C.border}`,
      transition: "all 0.2s",
      flexShrink: 0,
    }}>
      {done ? "✓" : n}
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())                                   e.fullName        = "Full name is required";
    if (!form.email)                                             e.email           = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))                  e.email           = "Enter a valid email address";
    if (!form.password)                                          e.password        = "Password is required";
    else if (form.password.length < 6)                           e.password        = "Must be at least 6 characters";
    if (!form.confirmPassword)                                   e.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password)             e.confirmPassword = "Passwords do not match";
    if (!agreed)                                                 e.terms           = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  // compute live "step" progress for the stepper
  const step = !form.fullName || !form.email ? 1 : !form.password || !form.confirmPassword ? 2 : 3;

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── LEFT DARK PANEL ────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(150deg, ${C.navy} 0%, #0D2B4A 55%, #1565C0 100%)`,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 48px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Rings */}
        {[460, 320, 190].map((sz, i) => (
          <div key={i} style={{
            position: "absolute", width: `${sz}px`, height: `${sz}px`,
            borderRadius: "50%", border: `1px solid rgba(66,165,245,${0.05 + i * 0.05})`,
            bottom: `${-sz / 2 + i * 22}px`, right: `${-sz / 2 + i * 22}px`,
          }} />
        ))}
        <div style={{ position: "absolute", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(33,150,243,0.12)", filter: "blur(70px)", top: "-60px", left: "-50px" }} />

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

        {/* Center content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "18px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "rgba(66,165,245,0.15)", border: "1px solid rgba(66,165,245,0.3)",
              color: "#90CAF9", fontSize: "11px", fontWeight: 700,
              letterSpacing: "1.2px", textTransform: "uppercase",
              padding: "5px 14px", borderRadius: "20px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#42A5F5", display: "inline-block" }} />
              Free · No credit card required
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 700, color: "#fff", lineHeight: 1.18,
            letterSpacing: "-0.8px", margin: "0 0 14px",
          }}>
            Join 120,000+<br />
            <span style={{ background: "linear-gradient(90deg, #42A5F5, #90CAF9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              professionals
            </span>{" "}who found their dream role.
          </h2>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.75, marginBottom: "32px" }}>
            Create a free account and get instant access to 25,000+ verified jobs from the world's leading companies.
          </p>

          {/* Benefits list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
            {[
              ["✅", "Instant access to 25,000+ verified job listings"],
              ["🎯", "AI-powered job matching based on your profile"],
              ["🔔", "Real-time alerts for roles that match your skills"],
              ["📊", "Salary benchmarks and company culture insights"],
              ["🚀", "One-click apply with your saved resume"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ fontSize: "15px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Company logos strip */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>
              Companies actively hiring
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { l: "G",  c: "#4285F4" }, { l: "Ms", c: "#00A4EF" },
                { l: "Az", c: "#FF9900" }, { l: "S",  c: "#635BFF" },
                { l: "AI", c: "#10a37f" }, { l: "N",  c: "#E50914" },
              ].map(({ l, c }) => (
                <div key={l} style={{
                  width: "34px", height: "34px", borderRadius: "8px",
                  background: c + "20", border: `1px solid ${c}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 800, color: c,
                }}>{l}</div>
              ))}
              <div style={{
                width: "34px", height: "34px", borderRadius: "8px",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.45)",
              }}>+4.8k</div>
            </div>
          </div>
        </div>

        {/* Bottom trust note */}
        <div style={{
          position: "relative", zIndex: 2,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px", padding: "16px 18px",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <span style={{ fontSize: "22px" }}>🔒</span>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>Your data is safe with us</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              256-bit SSL encryption · GDPR compliant · Never shared without consent.
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ───────────────────────────────────────── */}
      <div style={{
        background: C.white,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "40px 64px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {success ? (
            /* ── SUCCESS ─────────────────────────────────────── */
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: C.greenPale, border: `2px solid ${C.greenBd}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px", margin: "0 auto 20px",
              }}>🎉</div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "28px", fontWeight: 700, color: C.navy, margin: "0 0 10px" }}>
                Account created!
              </h2>
              <p style={{ color: C.gray, fontSize: "14px", lineHeight: 1.75, marginBottom: "24px" }}>
                Welcome to CareerHub, <strong style={{ color: C.navy }}>{form.fullName}</strong>!<br />
                We've sent a verification email to <strong style={{ color: C.blue }}>{form.email}</strong>.
              </p>
              <button style={{
                width: "100%", padding: "13px 0", borderRadius: "10px", border: "none",
                background: `linear-gradient(135deg, ${C.blue}, ${C.blueAcc})`,
                color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
              }}>Browse Jobs →</button>
              <div style={{ marginTop: "16px", height: "3px", borderRadius: "3px", background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "3px", background: `linear-gradient(90deg, ${C.blue}, ${C.blueAcc})`, animation: "progress 1.5s ease forwards" }} />
              </div>
              <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "28px", fontWeight: 700, color: C.navy, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
                  Create your account
                </h1>
                <p style={{ color: C.gray, fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                  Join CareerHub and start applying to top roles today.
                </p>
              </div>

              {/* Progress stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "24px" }}>
                {[["1", "Your Info"], ["2", "Security"], ["3", "Review"]].map(([n, label], i) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <StepDot n={n} active={step === i + 1} done={step > i + 1} />
                      <span style={{ fontSize: "10px", fontWeight: 600, color: step >= i + 1 ? C.blue : C.gray, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{label}</span>
                    </div>
                    {i < 2 && (
                      <div style={{ flex: 1, height: "2px", background: step > i + 1 ? C.blue : C.border, margin: "0 6px 14px", transition: "background 0.3s" }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <SocialBtn icon="🔵" label="Google" />
                <SocialBtn icon="🔗" label="LinkedIn" />
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
                <span style={{ fontSize: "12px", color: C.gray, fontWeight: 600, whiteSpace: "nowrap" }}>or register with email</span>
                <div style={{ flex: 1, height: "1px", background: C.border }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Row: first + last (from fullName) */}
                <AuthInput
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  hint="As it will appear on your profile"
                />
                <AuthInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  hint="We'll send a verification link here"
                />
                <AuthInput
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <StrengthMeter password={form.password} />
                <AuthInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />

                {/* Terms */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                    <div
                      onClick={() => { setAgreed(a => !a); if (errors.terms) setErrors(er => ({ ...er, terms: "" })); }}
                      style={{
                        width: "17px", height: "17px", borderRadius: "4px", flexShrink: 0, marginTop: "1px",
                        border: `2px solid ${errors.terms ? C.error : agreed ? C.blue : C.border}`,
                        background: agreed ? C.blue : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {agreed && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "13px", color: C.grayDark, lineHeight: 1.55 }}>
                      I agree to CareerHub's{" "}
                      <a href="#" style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}>Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
                    </span>
                  </label>
                  {errors.terms && (
                    <div style={{ marginTop: "5px", padding: "4px 10px", borderRadius: "6px", background: C.errorPale, border: `1px solid ${C.errorBd}`, fontSize: "12px", color: C.error, fontWeight: 500 }}>
                      ⚠ {errors.terms}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: "14px 0",
                    borderRadius: "10px", border: "none",
                    background: loading ? C.blueSoft : `linear-gradient(135deg, ${C.blue} 0%, ${C.blueAcc} 100%)`,
                    color: loading ? C.blue : "#fff",
                    fontSize: "15px", fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 6px 22px rgba(21,101,192,0.28)",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    fontFamily: "inherit",
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: "15px", height: "15px", borderRadius: "50%",
                        border: `2px solid ${C.blueSoft}`, borderTopColor: C.blue,
                        display: "inline-block", animation: "spin 0.7s linear infinite",
                      }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                      Creating your account…
                    </>
                  ) : "Create Account →"}
                </button>
              </form>

              {/* Login link */}
              <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: C.gray }}>
                Already have an account?{" "}
                <a href="#" style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}>Log in</a>
              </p>

              {/* Trust row */}
              <div style={{
                marginTop: "28px", borderTop: `1px solid ${C.border}`, paddingTop: "18px",
                display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap",
              }}>
                {["🔒 SSL Secured", "✅ GDPR Compliant", "🚀 Free forever"].map(item => (
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