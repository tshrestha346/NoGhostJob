import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanies, fetchJobs } from "../services/api";

const INDUSTRIES = [
  "All",
  "Technology",
  "FinTech",
  "Artificial Intelligence",
  "E-Commerce",
  "E-Commerce / Cloud",
  "Design Tools",
  "Entertainment / Streaming",
  "Social Media",
  "Productivity SaaS",
  "Travel & Hospitality",
  "Consumer Technology",
];

const SIZES = [
  "All Sizes",
  "500–1,000",
  "1,000–5,000",
  "5,000–10,000",
  "10,000–50,000",
  "50,000–100,000",
  "100,000+",
];

const TYPES = ["All Types", "Public", "Private"];

const SORT_OPTIONS = [
  ["top", "Top Rated"],
  ["openings", "Most Openings"],
  ["reviews", "Most Reviews"],
  ["newest", "Newest"],
  ["name", "Name A–Z"],
];

/*
|--------------------------------------------------------------------------
| Helper functions
|--------------------------------------------------------------------------
*/

function getCompanyIdFromJob(job) {
  if (!job) {
    return null;
  }

  // Populated company object
  if (job.company && typeof job.company === "object") {
    return (
      job.company._id ||
      job.company.id ||
      null
    );
  }

  // Company stored directly as an ID
  if (typeof job.company === "string") {
    return job.company;
  }

  // Other possible backend field names
  if (job.companyId) {
    return typeof job.companyId === "object"
      ? job.companyId._id || job.companyId.id
      : job.companyId;
  }

  if (job.company_id) {
    return typeof job.company_id === "object"
      ? job.company_id._id || job.company_id.id
      : job.company_id;
  }

  return null;
}

function extractJobsFromResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.jobs)) {
    return response.jobs;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.jobs)) {
    return response.data.jobs;
  }

  return [];
}

function formatReviews(reviews = 0) {
  const numericReviews = Number(reviews) || 0;

  if (numericReviews >= 1000) {
    return `${(numericReviews / 1000).toFixed(1)}k`;
  }

  return numericReviews;
}

/*
|--------------------------------------------------------------------------
| Small components
|--------------------------------------------------------------------------
*/

function Stars({ value = 0 }) {
  const rating = Number(value) || 0;

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((item) => (
        <span
          key={item}
          className={
            item <= Math.round(rating)
              ? "text-sm text-amber-400"
              : "text-sm text-slate-200"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function CompanyLogo({ company, size = "large" }) {
  const dimension =
    size === "small"
      ? "h-14 w-14 rounded-xl text-base"
      : "h-16 w-16 rounded-2xl text-lg";

  const fallbackColor = company?.color || "#1565C0";

  return (
    <div
      className={`grid shrink-0 place-items-center border border-white/70 font-black shadow-sm ${dimension}`}
      style={{
        color: fallbackColor,
        backgroundColor: `${fallbackColor}14`,
      }}
    >
      {company?.logo ? (
        <img
          src={company.logo}
          alt={`${company.name || "Company"} logo`}
          className="h-full w-full rounded-[inherit] object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        company?.initials ||
        company?.name?.slice(0, 2)?.toUpperCase() ||
        "CO"
      )}
    </div>
  );
}

function InformationPill({ children }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
      {children}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Company card
|--------------------------------------------------------------------------
*/

function CompanyCard({
  company,
  view,
  jobCount = 0,
  jobsLoading = false,
  onOpen,
}) {
  const rating = Number(company?.rating) || 0;
  const reviewsText = formatReviews(company?.reviews);
  const description =
    company?.description ||
    company?.desc ||
    "Explore available opportunities, company information and current vacancies.";

  const companyType =
    company?.type ||
    company?.companyType ||
    "Company";

  const companyIndustry =
    company?.industry ||
    "Industry not specified";

  const companyLocation =
    company?.location ||
    company?.country ||
    "Location not specified";

  const companySize =
    company?.size ||
    "Size not specified";

  const jobLabel = jobCount === 1 ? "open job" : "open jobs";

  if (view === "list") {
    return (
      <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
          <CompanyLogo company={company} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-bold text-slate-950">
                {company?.name || "Unnamed company"}
              </h2>

              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                {companyType}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {companyIndustry}
            </p>

            <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <InformationPill>
                <span className="mr-1.5">📍</span>
                {companyLocation}
              </InformationPill>

              <InformationPill>
                <span className="mr-1.5">👥</span>
                {companySize}
              </InformationPill>

              {company?.founded && (
                <InformationPill>
                  <span className="mr-1.5">📅</span>
                  Founded {company.founded}
                </InformationPill>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="min-w-[100px]">
              <div className="flex items-center gap-2">
                <strong className="text-xl font-extrabold text-slate-950">
                  {rating.toFixed(1)}
                </strong>

                <Stars value={rating} />
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {reviewsText} reviews
              </p>
            </div>

            <div className="min-w-[90px] text-center">
              <strong className="block text-3xl font-black text-blue-700">
                {jobsLoading ? "—" : jobCount}
              </strong>

              <span className="text-xs font-medium text-slate-500">
                {jobsLoading ? "Loading jobs" : jobLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpen}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              View Jobs
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 opacity-0 transition group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <CompanyLogo company={company} />

          <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            {companyType}
          </span>
        </div>

        <div className="mt-5">
          <h2 className="line-clamp-1 text-xl font-extrabold text-slate-950">
            {company?.name || "Unnamed company"}
          </h2>

          <p className="mt-1 text-sm font-semibold text-blue-700">
            {companyIndustry}
          </p>
        </div>

        <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <InformationPill>
            <span className="mr-1.5">📍</span>
            {companyLocation}
          </InformationPill>

          <InformationPill>
            <span className="mr-1.5">👥</span>
            {companySize}
          </InformationPill>
        </div>

        {Array.isArray(company?.tags) &&
          company.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {company.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

        <div className="mt-auto">
          <div className="my-5 h-px bg-slate-100" />

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xl font-extrabold text-slate-950">
                  {rating.toFixed(1)}
                </strong>

                <Stars value={rating} />
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {reviewsText} reviews
              </p>
            </div>

            <div className="text-right">
              <strong className="block text-3xl font-black text-blue-700">
                {jobsLoading ? "—" : jobCount}
              </strong>

              <span className="text-xs font-semibold text-slate-500">
                {jobsLoading ? "Loading jobs" : jobLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/15 transition hover:from-blue-800 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            View {jobsLoading ? "" : jobCount}{" "}
            {jobCount === 1 ? "Job" : "Jobs"}
            <span className="ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Main page
|--------------------------------------------------------------------------
*/

export default function CompaniesPage() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [size, setSize] = useState("All Sizes");
  const [type, setType] = useState("All Types");
  const [sort, setSort] = useState("top");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
    hasMore: false,
  });

  const [jobs, setJobs] = useState([]);

  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [companiesError, setCompaniesError] = useState("");
  const [jobsError, setJobsError] = useState("");

  const companyQuery = useMemo(
    () => ({
      search,
      industry,
      size,
      type,
      sort,
      page,
      limit: 12,
    }),
    [search, industry, size, type, sort, page]
  );

  /*
  |--------------------------------------------------------------------------
  | Load all jobs
  |--------------------------------------------------------------------------
  |
  | We request a high limit because the company count must be calculated from
  | the complete job list.
  |
  */

  useEffect(() => {
    let ignore = false;

    async function loadJobs() {
      try {
        setJobsLoading(true);
        setJobsError("");

        const response = await fetchJobs({
          page: 1,
          limit: 1000,
        });

        if (ignore) {
          return;
        }

        const jobsData = extractJobsFromResponse(response);

        setJobs(jobsData);
      } catch (error) {
        if (!ignore) {
          console.error("Failed to load jobs:", error);
          setJobs([]);
          setJobsError(
            error?.message ||
            "Unable to load job counts."
          );
        }
      } finally {
        if (!ignore) {
          setJobsLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      ignore = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load filtered companies
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadCompanies() {
      try {
        setCompaniesLoading(true);
        setCompaniesError("");

        const response = await fetchCompanies(companyQuery);

        if (ignore) {
          return;
        }

        const receivedCompanies = Array.isArray(response)
          ? response
          : response?.companies || [];

        const receivedPagination =
          response?.pagination || {
            page: 1,
            limit: 12,
            total: receivedCompanies.length,
            pages: 1,
            hasMore: false,
          };

        setCompanies((currentCompanies) => {
          if (page === 1) {
            return receivedCompanies;
          }

          const mergedCompanies = [
            ...currentCompanies,
            ...receivedCompanies,
          ];

          // Prevent duplicates when loading more pages
          return mergedCompanies.filter(
            (company, index, array) =>
              array.findIndex(
                (item) =>
                  String(item._id) === String(company._id)
              ) === index
          );
        });

        setPagination(receivedPagination);
      } catch (error) {
        if (!ignore) {
          console.error(
            "Failed to load companies:",
            error
          );

          setCompaniesError(
            error?.message ||
            "Unable to load companies."
          );
        }
      } finally {
        if (!ignore) {
          setCompaniesLoading(false);
        }
      }
    }

    loadCompanies();

    return () => {
      ignore = true;
    };
  }, [companyQuery, page]);

  /*
  |--------------------------------------------------------------------------
  | Group all jobs by company ID
  |--------------------------------------------------------------------------
  |
  | Every company ID receives an array of its jobs. The displayed number is
  | obtained through jobsByCompany[companyId].length.
  |
  */

  const jobsByCompany = useMemo(() => {
    return jobs.reduce((groupedJobs, job) => {
      const companyId = getCompanyIdFromJob(job);

      if (!companyId) {
        return groupedJobs;
      }

      const normalisedCompanyId = String(companyId);

      if (!groupedJobs[normalisedCompanyId]) {
        groupedJobs[normalisedCompanyId] = [];
      }

      groupedJobs[normalisedCompanyId].push(job);

      return groupedJobs;
    }, {});
  }, [jobs]);

  const getCompanyJobCount = (companyId) => {
    if (!companyId) {
      return 0;
    }

    const companyJobs =
      jobsByCompany[String(companyId)] || [];

    // The requested length method
    return companyJobs.length;
  };

  const visibleJobTotal = useMemo(() => {
    return companies.reduce((total, company) => {
      return total + getCompanyJobCount(company._id);
    }, 0);
  }, [companies, jobsByCompany]);

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */

  function applyFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function submitSearch(event) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function clearAll() {
    setSearchInput("");
    setSearch("");
    setIndustry("All");
    setSize("All Sizes");
    setType("All Types");
    setSort("top");
    setPage(1);
  }

  function openCompanyJobs(company) {
    navigate(`/companies/${company._id}/jobs`, {
      state: {
        company,
        companyName: company.name,
      },
    });
  }

  const hasActiveFilters =
    search ||
    industry !== "All" ||
    size !== "All Sizes" ||
    type !== "All Types";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            <span className="mr-2">✓</span>
            Verified employers
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Find companies that are
            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              actively hiring
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Compare companies, discover their open positions and
            find an opportunity that matches your career goals.
          </p>

          <form
            onSubmit={submitSearch}
            className="mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-white p-2 shadow-2xl shadow-black/30 sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 items-center">
              <span className="pl-4 text-slate-400">⌕</span>

              <input
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Search company, industry or location..."
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Search Companies
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Refine results
              </p>

              <h2 className="mt-1 text-xl font-extrabold">
                Filters
              </h2>
            </div>

            {hasActiveFilters && (
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-blue-700 px-2 text-xs font-bold text-white">
                {
                  [
                    search,
                    industry !== "All",
                    size !== "All Sizes",
                    type !== "All Types",
                  ].filter(Boolean).length
                }
              </span>
            )}
          </div>

          <div className="mt-6">
            <label
              htmlFor="company-industry"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Industry
            </label>

            <select
              id="company-industry"
              value={industry}
              onChange={(event) =>
                applyFilter(
                  setIndustry,
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {INDUSTRIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <label
              htmlFor="company-size"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Company size
            </label>

            <select
              id="company-size"
              value={size}
              onChange={(event) =>
                applyFilter(setSize, event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {SIZES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <label
              htmlFor="company-type"
              className="block text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Company type
            </label>

            <select
              id="company-type"
              value={type}
              onChange={(event) =>
                applyFilter(setType, event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clearAll}
            disabled={!hasActiveFilters}
            className="mt-7 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear all filters
          </button>
        </aside>

        {/* Company results */}
        <section className="min-w-0">
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  {pagination.total || 0}{" "}
                  {pagination.total === 1
                    ? "company"
                    : "companies"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {jobsLoading
                    ? "Calculating available positions..."
                    : `${visibleJobTotal} ${
                        visibleJobTotal === 1
                          ? "job"
                          : "jobs"
                      } across the companies shown`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sort}
                  onChange={(event) =>
                    applyFilter(
                      setSort,
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {SORT_OPTIONS.map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>

                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    aria-label="Grid view"
                    onClick={() => setView("grid")}
                    className={`grid h-9 w-9 place-items-center rounded-lg text-lg transition ${
                      view === "grid"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    ⊞
                  </button>

                  <button
                    type="button"
                    aria-label="List view"
                    onClick={() => setView("list")}
                    className={`grid h-9 w-9 place-items-center rounded-lg text-lg transition ${
                      view === "list"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>
          </div>

          {jobsError && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Companies were loaded, but the job counts could
              not be retrieved: {jobsError}
            </div>
          )}

          {companiesError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              <strong>Unable to load companies.</strong>
              <p className="mt-1 text-sm">
                {companiesError}
              </p>
            </div>
          )}

          {companiesLoading && page === 1 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                  <div className="mt-5 h-6 w-2/3 rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-1/3 rounded bg-slate-100" />
                  <div className="mt-6 h-4 rounded bg-slate-100" />
                  <div className="mt-2 h-4 rounded bg-slate-100" />
                  <div className="mt-8 h-12 rounded-xl bg-slate-200" />
                </div>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-3xl">
                🏢
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-950">
                No companies found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try using a different search term or removing
                some filters.
              </p>

              <button
                type="button"
                onClick={clearAll}
                className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              }
            >
              {companies.map((company) => {
                /*
                 * This is the real count:
                 *
                 * const companyJobs =
                 *   jobsByCompany[String(company._id)] || [];
                 *
                 * const jobCount = companyJobs.length;
                 */

                const companyJobs =
                  jobsByCompany[String(company._id)] || [];

                const jobCount = companyJobs.length;

                return (
                  <CompanyCard
                    key={company._id}
                    company={company}
                    view={view}
                    jobCount={jobCount}
                    jobsLoading={jobsLoading}
                    onOpen={() =>
                      openCompanyJobs(company)
                    }
                  />
                );
              })}
            </div>
          )}

          {pagination.hasMore && (
            <div className="mt-9 text-center">
              <button
                type="button"
                disabled={companiesLoading}
                onClick={() =>
                  setPage((currentPage) => currentPage + 1)
                }
                className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {companiesLoading
                  ? "Loading companies..."
                  : "Load more companies"}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}