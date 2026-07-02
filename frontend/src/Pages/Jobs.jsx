import { useEffect, useState } from "react";
import { fetchJobs, fetchCategories } from "../services/api";

function SectionLabel({ children }) {
  return (
    <span className="mb-3.5 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.3px] text-blue-700">
      {children}
    </span>
  );
}

function JobCard({ job }) {
  // Enhanced pill colors mapping all enum choices from your schema
  const typeClass = {
    "Full Time": "border-blue-200 bg-blue-50 text-blue-700",
    "Remote": "border-green-200 bg-green-50 text-green-700",
    "Hybrid": "border-amber-200 bg-amber-50 text-amber-700",
    "Part Time": "border-purple-200 bg-purple-50 text-purple-700",
    "Internship": "border-pink-200 bg-pink-50 text-pink-700",
  };

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white p-5 shadow-[0_2px_10px_rgba(10,30,60,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_12px_40px_rgba(21,101,192,0.13)]">
      {/* Top Section: Logo & Titles */}
      <div className="flex items-start gap-3">
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

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-serif text-base font-bold text-[#07192E]">
              {job.title}
            </h3>
            {job.isFeatured && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                Featured
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            🏢 {job.company} · 📍 {job.loc}
          </p>
        </div>
      </div>

      {/* Description Snippet */}
      {job.description && (
        <p className="line-clamp-2 text-xs leading-5 text-slate-600">
          {job.description}
        </p>
      )}

      {/* Requirements Tags (Render first 2 tags) */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.requirements.slice(0, 2).map((req, index) => (
            <span key={index} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              {req}
            </span>
          ))}
          {job.requirements.length > 2 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{job.requirements.length - 2} more
            </span>
          )}
        </div>
      )}

      {/* Footer Details */}
      <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-100">
        <span className="text-sm font-bold text-blue-700">{job.sal}</span>
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

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Input States
  const [kw, setKw] = useState("");
  const [loc, setLoc] = useState("");

  // Sidebar Filtering States
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  async function loadJobsData() {
    try {
      setLoading(true);
      const [jobsData, categoriesData] = await Promise.all([
        fetchJobs(kw, loc),
        fetchCategories(),
      ]);
      setJobs(jobsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load jobs data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobsData();
  }, []);

  async function handleSearch(e) {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchJobs(kw, loc);
      setJobs(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }

  // Client-side filtering mapping perfectly to your schema keys
  const filteredJobs = jobs.filter((job) => {
    const matchesType = selectedType === "All" || job.type === selectedType;
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesFeatured = !featuredOnly || job.isFeatured === true;

    return matchesType && matchesCategory && matchesFeatured;
  });

  return (
    <div className="min-h-screen bg-[#F7FAFF] font-['Segoe_UI',system-ui,sans-serif] text-[#07192E]">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-5 py-12 text-center sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionLabel>Live Marketplace</SectionLabel>
          <h1 className="mb-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Explore Open Positions
          </h1>
          <p className="mx-auto max-w-xl text-sm text-white/70">
            Ditch the ghost listings. Connect with actual active opportunities matching your tech stack.
          </p>
        </div>
      </section>

      {/* Layout Wrap */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        {/* Search Engine form controls */}
        <form
          onSubmit={handleSearch}
          className="mb-8 grid gap-2 rounded-2xl border border-[#DDEAFC] bg-white p-3 shadow-[0_10px_30px_rgba(7,25,46,0.04)] md:grid-cols-[1fr_1fr_auto] md:gap-0"
        >
          <div className="relative md:border-r md:border-[#DDEAFC]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            <input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder="Title, keywords, requirements..."
              className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm outline-none"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">📍</span>
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="City, State, or 'Remote'..."
              className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-8 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(21,101,192,0.2)] hover:opacity-95"
          >
            Find Positions
          </button>
        </form>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar panel */}
          <aside className="h-fit rounded-2xl border border-[#DDEAFC] bg-white p-6 shadow-[0_2px_10px_rgba(10,30,60,0.02)]">
            <h2 className="mb-5 font-serif text-base font-bold text-[#07192E] border-b border-slate-100 pb-2">
              Filter Options
            </h2>

            {/* Verification Toggles */}
            <div className="mb-6">
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Listing Type
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Featured Only
              </label>
            </div>

            {/* Mongoose Enum Types Mapping */}
            <div className="mb-6">
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Arrangement
              </label>
              <div className="flex flex-col gap-1">
                {["All", "Full Time", "Remote", "Hybrid", "Part Time", "Internship"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left rounded-xl px-3 py-2 text-sm transition-all ${
                      selectedType === type
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Schema Category Dropdown mapping */}
            <div>
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Category Sector
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-[#DDEAFC] bg-white p-3 text-sm text-[#07192E] outline-none focus:border-blue-400"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Results Block */}
          <div>
            <div className="mb-5">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-[#07192E]">{filteredJobs.length}</span> active job records
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-dashed border-[#DDEAFC] bg-white text-sm font-bold text-blue-700">
                Syncing database...
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#DDEAFC] bg-white py-20 text-center">
                <span className="mb-3 block text-3xl">📭</span>
                <h3 className="font-serif text-lg font-bold text-[#07192E]">No listings matched</h3>
                <p className="mt-1 text-sm text-slate-400 max-w-xs mx-auto">
                  Try adjusting your filters or targeting alternative categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}