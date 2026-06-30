import { useEffect, useRef, useState } from "react";
import {
  fetchJobs,
  fetchCompanies,
  fetchCategories,
  fetchTestimonials,
  subscribeNewsletter,
} from "../services/api";

function Counter({ end, suffix = "+" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = end / 60;

          const t = setInterval(() => {
            start += step;
            if (start >= end) {
              setVal(end);
              clearInterval(t);
            } else {
              setVal(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

function Stars({ value }) {
  return (
    <div className="flex justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-sm ${
            i <= Math.round(value) ? "text-amber-500" : "text-[#DDEAFC]"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="mb-3.5 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.3px] text-blue-700">
      {children}
    </span>
  );
}

const STATS = [
  { val: 15000, label: "Active Jobs", icon: "💼" },
  { val: 5000, label: "Verified Companies", icon: "🏢" },
  { val: 100000, label: "Job Seekers", icon: "🎓" },
  { val: 75000, label: "Successful Hires", icon: "📈" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Fast Hiring Process",
    desc: "Get matched with top companies in record time and skip the endless waiting.",
  },
  {
    icon: "✅",
    title: "Verified Companies",
    desc: "Every company on our platform is thoroughly vetted for legitimacy and culture.",
  },
  {
    icon: "🤖",
    title: "AI Job Matching",
    desc: "Smart algorithms analyze your profile and surface your most relevant opportunities.",
  },
  {
    icon: "🌐",
    title: "Remote Opportunities",
    desc: "Access thousands of remote-first positions from global leading companies.",
  },
];

function Hero({ setJobs }) {
  const [kw, setKw] = useState("");
  const [loc, setLoc] = useState("");

  async function handleSearch() {
    const data = await fetchJobs(kw, loc);
    setJobs(data);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
      {[500, 360, 220].map((sz, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-blue-300/10"
          style={{
            width: sz,
            height: sz,
            top: `${-sz / 2 + i * 30}px`,
            right: `${-sz / 2 + i * 30}px`,
          }}
        />
      ))}

      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-400/10 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.3px] text-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Trusted by 120,000+ professionals worldwide
        </span>

        <h1 className="mb-5 font-serif text-4xl font-bold leading-tight tracking-[-1.5px] text-white sm:text-5xl lg:text-6xl">
          Find Your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            Dream Job
          </span>{" "}
          Today
        </h1>

        <p className="mb-10 text-base leading-8 text-white/65 sm:text-lg">
          Connect with top employers and discover opportunities that match your
          skills, ambitions, and lifestyle.
        </p>

        <div className="mx-auto mb-8 grid max-w-3xl gap-2 rounded-2xl border border-[#DDEAFC] bg-white p-3 shadow-[0_20px_60px_rgba(7,25,46,0.25)] md:grid-cols-[1fr_1fr_auto] md:gap-0">
          <div className="relative md:border-r md:border-[#DDEAFC]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            <input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder="Job title, company, or skill…"
              className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#07192E] outline-none"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">📍</span>
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="City, state, or Remote…"
              className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#07192E] outline-none"
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-7 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(21,101,192,0.35)]"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section className="border-y border-blue-200 bg-blue-50 px-5 py-9 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="text-center lg:border-r lg:border-blue-200 last:border-r-0"
          >
            <div className="mb-1 text-3xl">{s.icon}</div>
            <div className="font-serif text-3xl font-extrabold leading-none text-blue-700">
              <Counter end={s.val} />
            </div>
            <div className="mt-1.5 text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function JobCard({ job }) {
  const typeClass = {
    "Full Time": "border-blue-200 bg-blue-50 text-blue-700",
    Remote: "border-green-200 bg-green-100 text-green-700",
    Hybrid: "border-amber-200 bg-amber-100 text-amber-700",
  };

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white p-5 shadow-[0_2px_10px_rgba(10,30,60,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_12px_40px_rgba(21,101,192,0.13)]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-extrabold"
          style={{
            backgroundColor: `${job.lc}18`,
            borderColor: `${job.lc}30`,
            color: job.lc,
          }}
        >
          {job.logo}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-serif text-base font-bold text-[#07192E]">
            {job.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            🏢 {job.company} · 📍 {job.loc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-blue-700">{job.sal}</span>
        <span className="flex-1" />
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
            typeClass[job.type] || "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {job.type}
        </span>
      </div>

      <button className="w-full rounded-lg bg-gradient-to-br from-blue-700 to-blue-400 py-2.5 text-sm font-bold text-white opacity-90 transition-opacity group-hover:opacity-100">
        Apply Now →
      </button>
    </div>
  );
}

function FeaturedJobs({ jobs }) {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Featured Roles</SectionLabel>
          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Featured Jobs
          </h2>
          <p className="text-slate-500">
            Discover exciting opportunities from top global companies
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((j) => <JobCard key={j._id} job={j} />)
          ) : (
            <p className="col-span-full text-center text-slate-500">
              No jobs found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function TopCompanies({ companies }) {
  return (
    <section className="border-t border-[#DDEAFC] bg-[#F7FAFF] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Hiring Now</SectionLabel>
          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Top Companies
          </h2>
          <p className="text-slate-500">
            Join industry leaders actively recruiting talent right now
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((co) => (
            <div
              key={co._id}
              className="cursor-pointer rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white px-3 py-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_8px_28px_rgba(21,101,192,0.12)]"
            >
              <div
                className="mx-auto mb-3 flex items-center justify-center rounded-xl border text-base font-extrabold"
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: `${co.color}18`,
                  borderColor: `${co.color}30`,
                  color: co.color,
                }}
              >
                {co.initials}
              </div>

              <div className="mb-1 text-sm font-bold text-[#07192E]">
                {co.name}
              </div>
              <Stars value={co.rating} />
              <div className="mt-1 text-[11px] text-slate-500">
                {co.openings} openings
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories({ categories }) {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Explore Fields</SectionLabel>
          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Browse by Category
          </h2>
          <p className="text-slate-500">Find roles in your field of expertise</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-[0_8px_28px_rgba(21,101,192,0.12)]"
            >
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-2xl">
                {cat.icon}
              </div>

              <div>
                <div className="mb-1 text-base font-bold text-[#07192E]">
                  {cat.name}
                </div>
                <div className="text-sm text-slate-500">
                  {cat.jobs?.toLocaleString()} open positions
                </div>
              </div>

              <span className="ml-auto text-xl font-bold text-blue-700 opacity-30 transition-opacity group-hover:opacity-100">
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="border-t border-[#DDEAFC] bg-[#F7FAFF] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Our Edge</SectionLabel>
          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Why Choose CareerHub
          </h2>
          <p className="text-slate-500">
            We make your job search experience exceptional
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[#DDEAFC] bg-white px-5 py-7 text-center shadow-[0_2px_10px_rgba(10,30,60,0.04)]"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-2xl">
                {f.icon}
              </div>
              <div className="mb-2 text-base font-bold text-[#07192E]">
                {f.title}
              </div>
              <p className="m-0 text-sm leading-6 text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }) {
  const [active, setActive] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const t = testimonials[active];

  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>Success Stories</SectionLabel>
        <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
          What Our Users Say
        </h2>
        <p className="mb-10 text-slate-500">Real stories from real job seekers</p>

        <div className="rounded-3xl border border-[#DDEAFC] bg-white px-6 py-10 shadow-[0_8px_40px_rgba(21,101,192,0.08)] sm:px-9">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-extrabold"
            style={{
              backgroundColor: `${t.color}18`,
              borderColor: `${t.color}40`,
              color: t.color,
            }}
          >
            {t.initials}
          </div>

          <Stars value={t.rating} />

          <p className="my-5 font-serif text-base italic leading-8 text-[#3D4A63] sm:text-lg">
            "{t.text}"
          </p>

          <div className="text-base font-bold text-[#07192E]">{t.name}</div>
          <div className="mt-1 text-sm text-slate-500">{t.role}</div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() =>
                setActive((active - 1 + testimonials.length) % testimonials.length)
              }
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DDEAFC] text-slate-500"
            >
              ‹
            </button>

            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-5 bg-blue-700" : "w-2 bg-[#DDEAFC]"
                }`}
              />
            ))}

            <button
              onClick={() => setActive((active + 1) % testimonials.length)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DDEAFC] text-slate-500"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    try {
      if (!email) return;

      const data = await subscribeNewsletter(email);

      if (data.message) {
        setDone(true);
        setError("");
      }
    } catch (err) {
      setError("Subscription failed. Try again.");
    }
  }

  return (
    <section className="bg-white px-5 pb-20 sm:px-8 lg:px-12">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#07192E] to-blue-700 px-6 py-14 text-center sm:px-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />

        <div className="relative z-10">
          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay Ahead of the Market
          </h2>
          <p className="mb-8 text-white/70">
            Get curated job alerts and career insights delivered to your inbox
            weekly.
          </p>

          {done ? (
            <div className="inline-block rounded-xl border border-white/25 bg-white/15 px-8 py-3.5 font-semibold text-white">
              ✓ You're subscribed! Welcome aboard.
            </div>
          ) : (
            <>
              <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    ✉️
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-white/15 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/45"
                  />
                </div>

                <button
                  onClick={handleSubscribe}
                  className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700"
                >
                  Subscribe
                </button>
              </div>

              {error && (
                <p className="mt-3 text-sm font-semibold text-red-200">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHomeData() {
    try {
      setLoading(true);

      const [jobsData, companiesData, categoriesData, testimonialsData] =
        await Promise.all([
          fetchJobs(),
          fetchCompanies(),
          fetchCategories(),
          fetchTestimonials(),
        ]);

      setJobs(jobsData);
      setCompanies(companiesData);
      setCategories(categoriesData);
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error("Failed to load home data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-bold text-blue-700">
        Loading NoGhostJob...
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden font-['Segoe_UI',system-ui,sans-serif]">
      <Hero setJobs={setJobs} />
      <StatsStrip />
      <FeaturedJobs jobs={jobs} />
      <TopCompanies companies={companies} />
      <Categories categories={categories} />
      <WhyUs />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </div>
  );
}