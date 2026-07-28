import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthInput({ label, name, type = "text", value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const isPassword = type === "password";
  const active = focused || value.length > 0;

  return (
    <div className="mb-5">
      <div className="relative">
        <label
          className={`
            absolute left-3.5 z-10 transition-all duration-200 pointer-events-none
            ${active
              ? "top-1.5 scale-[0.82] text-[11px] font-bold uppercase tracking-[0.4px] bg-white px-0.5"
              : "top-1/2 -translate-y-1/2 text-sm font-normal"
            }
            ${focused ? "text-blue-600" : error ? "text-red-600" : "text-slate-500"}
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
          className={`
            w-full rounded-xl border-[1.5px] text-sm text-[#07192E]
            outline-none transition-all duration-200 font-inherit box-border
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
              onClick={() => setShowPwd(!showPwd)}
              className="bg-transparent border-0 cursor-pointer text-base text-slate-500 p-0.5 leading-none"
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          ) : error ? (
            <span className="text-red-600 text-base">⚠</span>
          ) : value && !error ? (
            <span className="text-green-700 text-sm">✓</span>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1.5 rounded-md bg-red-50 border border-red-200">
          <span className="text-xs text-red-600">⚠</span>
          <span className="text-xs text-red-600 font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}

function SocialBtn({ icon, label }) {
  return (
    <button
      type="button"
      className="
        flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
        border-[1.5px] border-[#DDEAFC] bg-white text-[#3D4A63]
        text-sm font-semibold cursor-pointer transition-all duration-200
        hover:border-blue-400 hover:bg-blue-50
      "
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((er) => ({ ...er, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};

    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setLoading(true);
  setServerError("");
  setSuccess(false);

  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      }
    );

    const data = await res.json();

    console.log("Login API response:", data);

    if (!res.ok) {
      throw new Error(
        data.message || "Login failed"
      );
    }

    if (!data.token) {
      throw new Error(
        "Login succeeded, but no token was returned."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Clear previous login data
    |--------------------------------------------------------------------------
    */

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    /*
    |--------------------------------------------------------------------------
    | Store the complete API response
    |--------------------------------------------------------------------------
    */

    const storage = form.remember
      ? localStorage
      : sessionStorage;

    storage.setItem("token", data.token);
    storage.setItem(
      "user",
      JSON.stringify(data)
    );

    console.log(
      "Stored user:",
      JSON.parse(storage.getItem("user"))
    );

    /*
    |--------------------------------------------------------------------------
    | Redirect according to account type
    |--------------------------------------------------------------------------
    */

    setSuccess(true);

    if (data.accountType === "user") {
      navigate("/Udashboard", {
        replace: true,
      });
    } else if (
      data.accountType === "employer"
    ) {
      if (
        !data.companyId &&
        !data.company?._id
      ) {
        throw new Error(
          "Employer login succeeded, but no company is linked to this account."
        );
      }

      navigate("/EDashboard", {
        replace: true,
      });
    } else {
      navigate("/", {
        replace: true,
      });
    }

    if (onLoginSuccess) {
      onLoginSuccess(data);
    }
  } catch (err) {
    console.error("Login error:", err);

    setServerError(
      err.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

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
      <div className="relative overflow-hidden bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-6 py-8 sm:px-10 lg:px-12 lg:py-10 flex flex-col justify-between min-h-[520px] lg:min-h-screen">
        {[440, 300, 180].map((sz, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-300/10"
            style={{
              width: `${sz}px`,
              height: `${sz}px`,
              bottom: `${-sz / 2 + i * 20}px`,
              right: `${-sz / 2 + i * 20}px`,
            }}
          />
        ))}

        <div className="absolute w-72 h-72 rounded-full bg-blue-400/10 blur-[70px] -top-16 -left-16" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 border border-white/20 flex items-center justify-center text-white text-base font-extrabold">
            C
          </div>
          <span className="text-white font-serif text-2xl font-bold tracking-tight">
            CareerHub
          </span>
        </div>

        <div className="relative z-10 my-12 lg:my-0">
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 bg-blue-400/15 border border-blue-400/30 text-blue-200 text-[11px] font-bold tracking-[1.2px] uppercase px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              4,800+ Companies Hiring
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl xl:text-[40px] font-bold text-white leading-tight tracking-tight mb-4">
            Your next great
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              career move
            </span>{" "}
            starts here.
          </h2>

          <p className="text-white/60 text-sm sm:text-[15px] leading-7 mb-9 max-w-xl">
            Access 25,000+ verified jobs from the world's top companies. Your
            next opportunity is one login away.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["25K+", "Active Jobs", "💼"],
              ["4.8K+", "Top Companies", "🏢"],
              ["120K+", "Registered Candidates", "🎓"],
              ["18K+", "Successful Hires", "📈"],
            ].map(([v, l, icon]) => (
              <div
                key={l}
                className="bg-white/10 border border-white/10 rounded-xl p-4"
              >
                <div className="text-xs mb-1">{icon}</div>
                <div className="text-[22px] font-extrabold text-white leading-none font-serif">
                  {v}
                </div>
                <div className="text-[11px] text-white/55 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/10 border border-white/10 rounded-2xl p-5">
          <div className="flex gap-1 mb-2.5">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} className="text-amber-500 text-sm">
                {s}
              </span>
            ))}
          </div>

          <p className="text-white/75 text-sm leading-7 mb-3 italic font-serif">
            "Landed my dream role at Google within 3 weeks of signing up. The
            job matching is genuinely impressive."
          </p>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-400/30 border border-blue-400/40 flex items-center justify-center text-blue-200 text-xs font-extrabold">
              SJ
            </div>
            <div>
              <div className="text-xs font-bold text-white">Sarah Johnson</div>
              <div className="text-[11px] text-white/50">
                Senior Developer · Google
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white flex flex-col justify-center items-center px-5 py-10 sm:px-10 lg:px-16 lg:py-12 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {success ? (
            <div className="text-center">
              <div className="w-[72px] h-[72px] rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center text-3xl mx-auto mb-5">
                ✓
              </div>

              <h2 className="font-serif text-3xl font-bold text-[#07192E] mb-2.5">
                Welcome back!
              </h2>

              <p className="text-slate-500 text-sm leading-7">
                Login successful. Redirecting you to your dashboard…
              </p>

              <div className="mt-6 h-[3px] rounded bg-[#DDEAFC] overflow-hidden">
                <div className="h-full rounded bg-gradient-to-r from-blue-700 to-blue-400 animate-[progress_1.4s_ease_forwards]" />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-[#07192E] mb-2 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-slate-500 text-sm leading-6">
                  Log in to continue your job search and access your saved
                  roles.
                </p>
              </div>

              <div className="flex gap-2.5 mb-6">
                <SocialBtn icon="🔵" label="Google" />
                <SocialBtn icon="🔗" label="LinkedIn" />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[#DDEAFC]" />
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                  or continue with email
                </span>
                <div className="flex-1 h-px bg-[#DDEAFC]" />
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

                <div className="flex justify-between items-center mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, remember: !f.remember }))
                      }
                      className={`
                        w-[17px] h-[17px] rounded border-2 flex items-center justify-center
                        transition-all duration-150
                        ${form.remember
                          ? "bg-blue-700 border-blue-700"
                          : "bg-transparent border-[#DDEAFC]"
                        }
                      `}
                    >
                      {form.remember && (
                        <span className="text-white text-[10px] font-extrabold leading-none">
                          ✓
                        </span>
                      )}
                    </button>

                    <span className="text-sm text-[#3D4A63] font-medium">
                      Remember me
                    </span>
                  </label>

                  
                    <a
                    href="#"
                    className="text-sm text-blue-700 font-semibold no-underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full py-3.5 rounded-xl border-0 text-[15px] font-bold
                    tracking-[0.2px] transition-all duration-200 flex items-center justify-center gap-2
                    ${loading
                      ? "bg-blue-200 text-blue-700 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-br from-blue-700 to-blue-400 text-white cursor-pointer shadow-[0_6px_22px_rgba(21,101,192,0.3)]"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-blue-200 border-t-blue-700 inline-block animate-[spin_0.7s_linear_infinite]" />
                      Logging in…
                    </>
                  ) : (
                    "Log In →"
                  )}
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-slate-500">
                Don't have an account?{" "}
                <a href="#" className="text-blue-700 font-bold no-underline">
                  Create one free
                </a>
              </p>

              <div className="mt-8 border-t border-[#DDEAFC] pt-5 flex flex-wrap justify-center gap-4 sm:gap-5">
                {["🔒 Secure login", "✅ Verified employers", "🚀 Free forever"].map(
                  (item) => (
                    <span
                      key={item}
                      className="text-[11px] text-slate-500 font-medium"
                    >
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