import { useEffect, useState } from "react";
// Assuming you have an api helper like fetchJobById or use your existing endpoints
import { fetchJobs } from "../services/api"; 

function SectionLabel({ children }) {
  return (
    <span className="mb-3.5 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.3px] text-blue-700">
      {children}
    </span>
  );
}

export default function JobDetailsPage({ jobId }) {
  // NOTE: If using react-router-dom, extract jobId via: const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadJobDetails() {
      try {
        setLoading(true);
        // Fallback or specific dynamic ID search via your api provider
        const allJobs = await fetchJobs();
        const foundJob = allJobs.find((j) => j._id === jobId);
        setJob(foundJob);
      } catch (error) {
        console.error("Failed to load individual job specifications:", error);
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const handleFinalApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission handler pipeline 
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setApplied(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-bold text-blue-700">
        Loading job specifications...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center p-5">
        <span className="text-4xl mb-2">🕵️‍♂️</span>
        <h3 className="font-serif text-lg font-bold text-[#07192E]">Position Not Found</h3>
        <p className="text-sm text-slate-500 mt-1">This listing may have expired or been filled.</p>
      </div>
    );
  }

  const typeClass = {
    "Full Time": "border-blue-200 bg-blue-50 text-blue-700",
    "Remote": "border-green-200 bg-green-50 text-green-700",
    "Hybrid": "border-amber-200 bg-amber-50 text-amber-700",
    "Part Time": "border-purple-200 bg-purple-50 text-purple-700",
    "Internship": "border-pink-200 bg-pink-50 text-pink-700",
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] font-['Segoe_UI',system-ui,sans-serif] text-[#07192E]">
      
      {/* Top Breadcrumb Style Jumbotron Header */}
      <section className="bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${typeClass[job.type] || "bg-white/10 text-white border-white/20"}`}>
              {job.type}
            </span>
            {job.category && (
              <span className="text-xs font-semibold text-blue-200 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-700/30">
                {job.category}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            {job.title}
          </h1>

          <p className="mt-3 text-base text-white/80 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>🏢 <strong className="text-white">{job.company}</strong></span>
            <span>📍 {job.loc}</span>
            <span>💰 <strong className="text-blue-300">{job.sal}</strong></span>
          </p>
        </div>
      </section>

      {/* Main Container Layout split */}
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12 grid gap-8 lg:grid-cols-[1fr_340px]">
        
        {/* Left Side: Structural Details Overview */}
        <div className="flex flex-col gap-8 rounded-2xl border border-[#DDEAFC] bg-white p-6 sm:p-8 shadow-[0_2px_10px_rgba(10,30,60,0.02)]">
          
          {/* Section: Description mapping block schema values */}
          <div>
            <h2 className="font-serif text-xl font-bold text-[#07192E] mb-3">
              Role Overview
            </h2>
            <p className="text-sm leading-7 text-slate-600 whitespace-pre-line">
              {job.description || "No specific operational description summary provided for this job opening."}
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Dynamic String Array Requirements list mapper */}
          <div>
            <h2 className="font-serif text-xl font-bold text-[#07192E] mb-3">
              Core Prerequisites & Requirements
            </h2>
            {job.requirements && job.requirements.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
                    <span className="text-blue-500 mt-1 shrink-0 text-xs">⚡</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">No standard technical conditions cataloged.</p>
            )}
          </div>
        </div>

        {/* Right Side Sticky Sidebar: Application Trigger Box */}
        <aside className="h-fit sticky top-6 rounded-2xl border border-[#DDEAFC] bg-white p-6 shadow-[0_4px_20px_rgba(7,25,46,0.04)]">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-extrabold"
              style={{
                backgroundColor: `${job.lc || "#1565C0"}18`,
                borderColor: `${job.lc || "#1565C0"}30`,
                color: job.lc || "#1565C0",
              }}
            >
              {job.logo || "💼"}
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#07192E] truncate max-w-[180px]">
                {job.company}
              </h3>
              <p className="text-xs text-slate-400">Active hiring partner</p>
            </div>
          </div>

          {applied ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <span className="text-2xl mb-1 block">🎉</span>
              <h4 className="text-sm font-bold text-green-800">Application Submitted!</h4>
              <p className="text-xs text-green-600 mt-1">
                Your credentials went straight to the internal team. Check your email for updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFinalApplication} className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Express Interest Directly
              </h4>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[#DDEAFC] p-3 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-[#DDEAFC] p-3 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(21,101,192,0.2)] hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Processing Application..." : "Submit My Application"}
              </button>
              
              <p className="text-[11px] text-center text-slate-400 leading-4">
                By applying, you send your parsed system profile details instantly to the verified company recruiter dashboard.
              </p>
            </form>
          )}
        </aside>

      </main>
    </div>
  );
}