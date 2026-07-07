import { useMemo, useState } from "react";

function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const STRENGTH_META = [
  { label: "Too short", color: "bg-red-600", text: "text-red-600", bg: "bg-red-100" },
  { label: "Weak", color: "bg-red-600", text: "text-red-600", bg: "bg-red-100" },
  { label: "Fair", color: "bg-amber-700", text: "text-amber-700", bg: "bg-amber-100" },
  { label: "Good", color: "bg-teal-600", text: "text-teal-600", bg: "bg-teal-100" },
  { label: "Strong 🔒", color: "bg-green-700", text: "text-green-700", bg: "bg-green-100" },
];

function AuthInput({ label, name, type = "text", value, onChange, error, hint }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const isPassword = type === "password";
  const active = focused || value.length > 0;

  return (
    <div className="mb-[18px]">
      <div className="relative">
        <label
          className={`
            absolute left-3.5 z-10 pointer-events-none transition-all duration-200 origin-left
            ${active
              ? "top-1.5 scale-[0.8] text-[11px] font-bold uppercase tracking-[0.5px] bg-white px-0.5"
              : "top-1/2 -translate-y-1/2 text-sm font-normal"
            }
            ${focused ? "text-blue-700" : error ? "text-red-600" : "text-slate-500"}
          `}
        >
          {label}
        </label>

        <input
          name={name}
          type={isPassword ? (showPwd ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={isPassword ? "new-password" : "off"}
          className={`
            w-full rounded-xl border-[1.5px] text-sm text-[#07192E]
            outline-none transition-all duration-200 box-border
            ${active ? "px-3.5 pt-[22px] pb-2 pr-11" : "px-3.5 py-[15px] pr-11"}
            ${error
              ? "border-red-600 bg-red-50"
              : focused
              ? "border-blue-400 bg-white shadow-[0_0_0_3px_#E3F2FD]"
              : "border-[#DDEAFC] bg-[#F7FAFF]"
            }
          `}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="border-0 bg-transparent p-0.5 text-base leading-none text-slate-500 cursor-pointer"
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          ) : error ? (
            <span className="text-red-600 text-[15px]">⚠</span>
          ) : value && !error ? (
            <span className="text-green-700 text-sm font-bold">✓</span>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5">
          <span className="text-[11px] text-red-600">⚠</span>
          <span className="text-xs font-medium text-red-600">{error}</span>
        </div>
      )}

      {hint && !error && (
        <div className="mt-1.5 pl-0.5 text-[11px] text-slate-500">{hint}</div>
      )}
    </div>
  );
}

function StrengthMeter({ password }) {
  const score = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  const meta = STRENGTH_META[score];

  return (
    <div className="-mt-2.5 mb-[18px]">
      <div className="mb-1.5 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded transition-colors duration-300 ${
              i < score ? meta.color : "bg-[#DDEAFC]"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.text} ${meta.bg}`}>
          {meta.label}
        </span>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }) {
  return (
    <button
      type="button"
      className="
        flex-1 flex items-center justify-center gap-2 rounded-xl
        border-[1.5px] border-[#DDEAFC] bg-white py-3
        text-sm font-semibold text-[#3D4A63]
        transition-all duration-200 hover:border-blue-400 hover:bg-blue-50
      "
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

function StepDot({ n, active, done }) {
  return (
    <div
      className={`
        flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2
        text-xs font-bold transition-all duration-200
        ${done
          ? "border-green-700 bg-green-700 text-white"
          : active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-[#DDEAFC] bg-[#EEF2F7] text-slate-500"
        }
      `}
    >
      {done ? "✓" : n}
    </div>
  );
}

export default function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAndCondition: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({ ...f, [name]: value }));

    if (errors[name]) {
      setErrors((er) => ({ ...er, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};

    if (!form.fullName.trim()) e.fullName = "Full name is required";

    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Must be at least 6 characters";

    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match";

    if (!agreed) e.terms = "You must agree to the terms";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          termsAndCondition: agreed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          isActive: data.isActive,
          isAdmin: data.isAdmin,
          accountType: data.accountType,
        })
      );

      setLoading(false);
      setSuccess(true);

      if (onRegisterSuccess) {
        setTimeout(() => onRegisterSuccess(data), 1500);
      }
    } catch (err) {
      setLoading(false);
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  };

  const step =
    !form.fullName || !form.email
      ? 1
      : !form.password || !form.confirmPassword
      ? 2
      : 3;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-['Segoe_UI',system-ui,sans-serif]">
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-6 py-8 sm:px-10 lg:min-h-screen lg:px-12 lg:py-10">
        {[460, 320, 190].map((sz, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-300/10"
            style={{
              width: `${sz}px`,
              height: `${sz}px`,
              bottom: `${-sz / 2 + i * 22}px`,
              right: `${-sz / 2 + i * 22}px`,
            }}
          />
        ))}

        <div className="absolute -left-12 -top-16 h-64 w-64 rounded-full bg-blue-400/10 blur-[70px]" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-gradient-to-br from-blue-400 to-blue-700 text-base font-extrabold text-white">
            C
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            CareerHub
          </span>
        </div>

        <div className="relative z-10 my-12 lg:my-0">
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[1.2px] text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Free · No credit card required
            </span>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl xl:text-[38px]">
            Join 120,000+
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              professionals
            </span>{" "}
            who found their dream role.
          </h2>

          <p className="mb-8 max-w-xl text-sm leading-7 text-white/60">
            Create a free account and get instant access to 25,000+ verified
            jobs from the world's leading companies.
          </p>

          <div className="mb-9 flex flex-col gap-3">
            {[
              ["✅", "Instant access to 25,000+ verified job listings"],
              ["🎯", "AI-powered job matching based on your profile"],
              ["🔔", "Real-time alerts for roles that match your skills"],
              ["📊", "Salary benchmarks and company culture insights"],
              ["🚀", "One-click apply with your saved resume"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 text-[15px]">{icon}</span>
                <span className="text-sm leading-6 text-white/70">{text}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.8px] text-white/40">
              Companies actively hiring
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { l: "G", c: "text-[#4285F4]", bg: "bg-[#4285F4]/20", bd: "border-[#4285F4]/40" },
                { l: "Ms", c: "text-[#00A4EF]", bg: "bg-[#00A4EF]/20", bd: "border-[#00A4EF]/40" },
                { l: "Az", c: "text-[#FF9900]", bg: "bg-[#FF9900]/20", bd: "border-[#FF9900]/40" },
                { l: "S", c: "text-[#635BFF]", bg: "bg-[#635BFF]/20", bd: "border-[#635BFF]/40" },
                { l: "AI", c: "text-[#10A37F]", bg: "bg-[#10A37F]/20", bd: "border-[#10A37F]/40" },
                { l: "N", c: "text-[#E50914]", bg: "bg-[#E50914]/20", bd: "border-[#E50914]/40" },
              ].map(({ l, c, bg, bd }) => (
                <div
                  key={l}
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg border text-[11px] font-extrabold ${c} ${bg} ${bd}`}
                >
                  {l}
                </div>
              ))}

              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white/10 bg-white/10 text-[10px] font-bold text-white/45">
                +4.8k
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-4">
          <span className="text-2xl">🔒</span>
          <div>
            <div className="mb-0.5 text-xs font-bold text-white">
              Your data is safe with us
            </div>
            <div className="text-[11px] leading-5 text-white/50">
              256-bit SSL encryption · GDPR compliant · Never shared without
              consent.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center overflow-y-auto bg-white px-5 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-[420px]">
          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-green-200 bg-green-100 text-3xl">
                🎉
              </div>

              <h2 className="mb-2.5 font-serif text-3xl font-bold text-[#07192E]">
                Account created!
              </h2>

              <p className="mb-6 text-sm leading-7 text-slate-500">
                Welcome to CareerHub,{" "}
                <strong className="text-[#07192E]">{form.fullName}</strong>!
                <br />
                We've sent a verification email to{" "}
                <strong className="text-blue-700">{form.email}</strong>.
              </p>

              <button className="w-full rounded-xl border-0 bg-gradient-to-br from-blue-700 to-blue-400 py-3.5 text-sm font-bold text-white">
                Browse Jobs →
              </button>

              <div className="mt-4 h-[3px] overflow-hidden rounded bg-[#DDEAFC]">
                <div className="h-full rounded bg-gradient-to-r from-blue-700 to-blue-400 animate-[progress_1.5s_ease_forwards]" />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="mb-1.5 font-serif text-3xl font-bold tracking-tight text-[#07192E]">
                  Create your account
                </h1>
                <p className="text-sm leading-6 text-slate-500">
                  Join CareerHub and start applying to top roles today.
                </p>
              </div>

              <div className="mb-6 flex items-center">
                {[["1", "Your Info"], ["2", "Security"], ["3", "Review"]].map(
                  ([n, label], i) => (
                    <div key={n} className={`flex items-center ${i < 2 ? "flex-1" : ""}`}>
                      <div className="flex flex-col items-center gap-1">
                        <StepDot n={n} active={step === i + 1} done={step > i + 1} />
                        <span
                          className={`whitespace-nowrap text-[10px] font-semibold tracking-[0.3px] ${
                            step >= i + 1 ? "text-blue-700" : "text-slate-500"
                          }`}
                        >
                          {label}
                        </span>
                      </div>

                      {i < 2 && (
                        <div
                          className={`mx-1.5 mb-3.5 h-0.5 flex-1 transition-colors duration-300 ${
                            step > i + 1 ? "bg-blue-700" : "bg-[#DDEAFC]"
                          }`}
                        />
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="mb-5 flex gap-2.5">
                <SocialBtn icon="🔵" label="Google" />
                <SocialBtn icon="🔗" label="LinkedIn" />
              </div>

              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#DDEAFC]" />
                <span className="whitespace-nowrap text-xs font-semibold text-slate-500">
                  or register with email
                </span>
                <div className="h-px flex-1 bg-[#DDEAFC]" />
              </div>

              {serverError && (
                <div className="mb-5 flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
                  <span className="text-sm text-red-600">⚠</span>
                  <span className="text-sm font-medium text-red-600">
                    {serverError}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
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

                <div className="mb-5">
                  <label className="flex cursor-pointer items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setAgreed((a) => !a);
                        if (errors.terms) {
                          setErrors((er) => ({ ...er, terms: "" }));
                        }
                      }}
                      className={`
                        mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded border-2 transition-all duration-150
                        ${errors.terms
                          ? "border-red-600"
                          : agreed
                          ? "border-blue-700 bg-blue-700"
                          : "border-[#DDEAFC] bg-transparent"
                        }
                      `}
                    >
                      {agreed && (
                        <span className="text-[10px] font-extrabold leading-none text-white">
                          ✓
                        </span>
                      )}
                    </button>

                    <span className="text-sm leading-6 text-[#3D4A63]">
                      I agree to CareerHub's{" "}
                      <a href="#" className="font-semibold text-blue-700 no-underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="font-semibold text-blue-700 no-underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  {errors.terms && (
                    <div className="mt-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                      ⚠ {errors.terms}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    flex w-full items-center justify-center gap-2 rounded-xl border-0 py-3.5
                    text-[15px] font-bold transition-all duration-200
                    ${loading
                      ? "cursor-not-allowed bg-blue-200 text-blue-700 shadow-none"
                      : "cursor-pointer bg-gradient-to-br from-blue-700 to-blue-400 text-white shadow-[0_6px_22px_rgba(21,101,192,0.28)]"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-[15px] w-[15px] rounded-full border-2 border-blue-200 border-t-blue-700 animate-[spin_0.7s_linear_infinite]" />
                      Creating your account…
                    </>
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <a href="#" className="font-bold text-blue-700 no-underline">
                  Log in
                </a>
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-4 border-t border-[#DDEAFC] pt-5 sm:gap-5">
                {["🔒 SSL Secured", "✅ GDPR Compliant", "🚀 Free forever"].map(
                  (item) => (
                    <span key={item} className="text-[11px] font-medium text-slate-500">
                      {item}
                    </span>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}