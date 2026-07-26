import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCompanyJobs } from "../services/api";

export default function CompanyJobsPage() {
  const { companyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      jobType: searchParams.get("jobType") || "All",
      experience: searchParams.get("experience") || "All",
      sort: searchParams.get("sort") || "newest",
    }),
    [searchParams]
  );

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    fetchCompanyJobs(companyId, filters)
      .then((data) => {
        if (ignore) return;
        setCompany(data.company);
        setJobs(data.jobs || []);
      })
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [companyId, filters]);

  const updateFilter = (name, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All") next.delete(name);
    else next.set(name, value);
    setSearchParams(next);
  };

  if (loading) return <div className="min-h-screen grid place-items-center">Loading jobs...</div>;
  if (error) return <div className="min-h-screen grid place-items-center text-red-600">{error}</div>;

  return (
    <main className="min-h-screen bg-[#F7FAFF] px-5 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/companies" className="text-sm font-semibold text-[#1565C0]">← All companies</Link>

        <section className="mt-5 rounded-2xl border border-[#DDEAFC] bg-white p-6">
          <div className="flex items-center gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-xl text-xl font-extrabold"
              style={{ color: company?.color, background: `${company?.color || "#1565C0"}18` }}
            >
              {company?.initials || company?.name?.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#07192E]">{company?.name} jobs</h1>
              <p className="mt-1 text-sm text-[#6B7A99]">
                {company?.industry} · {company?.location} · {company?.openings || 0} open roles
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 rounded-2xl border border-[#DDEAFC] bg-white p-4 md:grid-cols-5">
          <input
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Job title or skill"
            className="rounded-lg border border-[#DDEAFC] px-3 py-2 md:col-span-2"
          />
          <input
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            placeholder="Location"
            className="rounded-lg border border-[#DDEAFC] px-3 py-2"
          />
          <select value={filters.jobType} onChange={(e) => updateFilter("jobType", e.target.value)} className="rounded-lg border border-[#DDEAFC] px-3 py-2">
            <option>All</option><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
          </select>
          <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="rounded-lg border border-[#DDEAFC] px-3 py-2">
            <option value="newest">Newest</option><option value="oldest">Oldest</option>
          </select>
        </section>

        <div className="mt-6 space-y-4">
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-[#DDEAFC] bg-white p-12 text-center text-[#6B7A99]">No jobs match these filters.</div>
          ) : jobs.map((job) => (
            <article key={job._id} className="rounded-2xl border border-[#DDEAFC] bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#07192E]">{job.title}</h2>
                  <p className="mt-1 text-sm text-[#6B7A99]">
                    {job.location} · {job.jobType || job.type} · {job.experienceLevel || "Open experience"}
                  </p>
                  {Array.isArray(job.skills) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map((skill) => <span key={skill} className="rounded-full bg-[#E3F2FD] px-3 py-1 text-xs font-semibold text-[#1565C0]">{skill}</span>)}
                    </div>
                  )}
                </div>
                <Link to={`/jobs/${job._id}`} className="rounded-lg bg-[#1565C0] px-5 py-3 text-center text-sm font-bold text-white">
                  View Job →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
