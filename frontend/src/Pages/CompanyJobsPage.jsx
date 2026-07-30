import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { fetchCompanyJobs } from "../services/api";

/*
|--------------------------------------------------------------------------
| Filter options
|--------------------------------------------------------------------------
*/

const JOB_TYPES = [
  "All",
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Temporary",
  "Working Student",
  "Mini Job",
];

const EXPERIENCE_LEVELS = [
  "All",
  "Entry Level",
  "Junior",
  "Mid Level",
  "Senior",
  "Lead",
  "Manager",
];

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
  {
    value: "title",
    label: "Job title A–Z",
  },
];

/*
|--------------------------------------------------------------------------
| Helper functions
|--------------------------------------------------------------------------
*/

function formatDate(value) {
  if (!value) {
    return "Recently posted";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently posted";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatSalary(job) {
  if (job?.salary) {
    if (typeof job.salary === "string") {
      return job.salary;
    }

    if (typeof job.salary === "object") {
      const minimum =
        job.salary.min ??
        job.salary.minimum ??
        job.salary.from;

      const maximum =
        job.salary.max ??
        job.salary.maximum ??
        job.salary.to;

      const currency =
        job.salary.currency || "EUR";

      const period =
        job.salary.period ||
        job.salary.interval ||
        "year";

      if (minimum && maximum) {
        return `${currency} ${Number(
          minimum
        ).toLocaleString("en-GB")}–${Number(
          maximum
        ).toLocaleString("en-GB")} / ${period}`;
      }

      if (minimum) {
        return `From ${currency} ${Number(
          minimum
        ).toLocaleString("en-GB")} / ${period}`;
      }

      if (maximum) {
        return `Up to ${currency} ${Number(
          maximum
        ).toLocaleString("en-GB")} / ${period}`;
      }
    }
  }

  if (job?.salaryMin && job?.salaryMax) {
    return `EUR ${Number(
      job.salaryMin
    ).toLocaleString("en-GB")}–${Number(
      job.salaryMax
    ).toLocaleString("en-GB")}`;
  }

  return "";
}

function getJobType(job) {
  return (
    job?.jobType ||
    job?.employmentType ||
    job?.type ||
    "Job type not specified"
  );
}

function getExperience(job) {
  return (
    job?.experienceLevel ||
    job?.experience ||
    "Open experience"
  );
}

function getLocation(job) {
  if (typeof job?.location === "string") {
    return job.location;
  }

  if (
    job?.location &&
    typeof job.location === "object"
  ) {
    return [
      job.location.city,
      job.location.state,
      job.location.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return "Location not specified";
}

function getDescription(job) {
  return (
    job?.shortDescription ||
    job?.summary ||
    job?.description ||
    "View the complete job description, responsibilities and requirements."
  );
}

/*
|--------------------------------------------------------------------------
| Company logo
|--------------------------------------------------------------------------
*/

function CompanyLogo({ company }) {
  const companyColor =
    company?.color || "#1565C0";

  return (
    <div
      className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/20 text-xl font-black shadow-xl"
      style={{
        color: companyColor,
        backgroundColor: company?.logo
          ? "#FFFFFF"
          : `${companyColor}18`,
      }}
    >
      {company?.logo ? (
        <img
          src={company.logo}
          alt={`${company?.name || "Company"} logo`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display =
              "none";
          }}
        />
      ) : (
        company?.initials ||
        company?.name
          ?.slice(0, 2)
          ?.toUpperCase() ||
        "CO"
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Filter field
|--------------------------------------------------------------------------
*/

function FilterField({
  label,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      {children}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Job information badge
|--------------------------------------------------------------------------
*/

function JobBadge({
  icon,
  children,
  highlighted = false,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
        highlighted
          ? "border-blue-100 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      <span>{icon}</span>
      {children}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Job card
|--------------------------------------------------------------------------
*/

function JobCard({ job, company }) {
  const salary = formatSalary(job);
  const jobType = getJobType(job);
  const experience = getExperience(job);
  const location = getLocation(job);
  const description = getDescription(job);

  const skills = Array.isArray(job?.skills)
    ? job.skills
    : [];

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-700 to-cyan-400 opacity-0 transition group-hover:opacity-100" />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">
                    {job?.title ||
                      "Untitled position"}
                  </h2>

                  {job?.featured && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      Featured
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-semibold text-blue-700">
                  {company?.name ||
                    job?.company?.name ||
                    "Company"}
                </p>
              </div>

              <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Open
              </span>
            </div>

            <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
              {description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <JobBadge icon="📍">
                {location}
              </JobBadge>

              <JobBadge
                icon="💼"
                highlighted
              >
                {jobType}
              </JobBadge>

              <JobBadge icon="📈">
                {experience}
              </JobBadge>

              {job?.remote && (
                <JobBadge icon="🏠">
                  Remote available
                </JobBadge>
              )}

              {salary && (
                <JobBadge icon="💰">
                  {salary}
                </JobBadge>
              )}
            </div>

            {skills.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {skills
                    .slice(0, 6)
                    .map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}

                  {skills.length > 6 && (
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      +{skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col border-t border-slate-100 pt-4 lg:min-w-[175px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="text-sm">
              <p className="font-semibold text-slate-500">
                Posted
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {formatDate(
                  job?.createdAt ||
                    job?.postedAt
                )}
              </p>
            </div>

            <Link
              to={`/jobs/${job._id}`}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/15 transition hover:from-blue-800 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              View job
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Loading skeleton
|--------------------------------------------------------------------------
*/

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-72 animate-pulse bg-slate-900" />

      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="h-28 animate-pulse rounded-2xl bg-white" />

        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="h-7 w-2/5 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-1/4 rounded bg-slate-100" />
              <div className="mt-6 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
              <div className="mt-6 flex gap-2">
                <div className="h-8 w-24 rounded bg-slate-100" />
                <div className="h-8 w-24 rounded bg-slate-100" />
                <div className="h-8 w-24 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

export default function CompanyJobsPage() {
  const { companyId } = useParams();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [company, setCompany] =
    useState(null);

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Read filters from URL
  |--------------------------------------------------------------------------
  */

  const filters = useMemo(
    () => ({
      search:
        searchParams.get("search") || "",

      location:
        searchParams.get("location") ||
        "",

      jobType:
        searchParams.get("jobType") ||
        "All",

      experience:
        searchParams.get(
          "experience"
        ) || "All",

      sort:
        searchParams.get("sort") ||
        "newest",
    }),
    [searchParams]
  );

  /*
  |--------------------------------------------------------------------------
  | Load company and jobs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadCompanyJobs() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetchCompanyJobs(
            companyId,
            filters
          );

        if (ignore) {
          return;
        }

        setCompany(
          response?.company || null
        );

        setJobs(
          Array.isArray(response?.jobs)
            ? response.jobs
            : []
        );
      } catch (requestError) {
        if (!ignore) {
          console.error(
            "Failed to load company jobs:",
            requestError
          );

          setError(
            requestError?.message ||
              "Unable to load this company's jobs."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCompanyJobs();

    return () => {
      ignore = true;
    };
  }, [companyId, filters]);

  /*
  |--------------------------------------------------------------------------
  | Update URL filters
  |--------------------------------------------------------------------------
  */

  function updateFilter(name, value) {
    const nextParams =
      new URLSearchParams(
        searchParams
      );

    if (
      !value ||
      value === "All" ||
      value === "newest"
    ) {
      nextParams.delete(name);
    } else {
      nextParams.set(name, value);
    }

    setSearchParams(nextParams, {
      replace: true,
    });
  }

  function clearFilters() {
    setSearchParams({}, {
      replace: true,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Derived values
  |--------------------------------------------------------------------------
  */

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.jobType !== "All" ||
    filters.experience !== "All" ||
    filters.sort !== "newest";

  // Real number of returned jobs using the length method
  const jobCount = jobs.length;

  const companyDescription =
    company?.description ||
    company?.desc ||
    "Explore current job opportunities and learn more about this company.";

  /*
  |--------------------------------------------------------------------------
  | Loading and error states
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-3xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-950">
            Unable to load jobs
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error}
          </p>

          <Link
            to="/companies"
            className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Return to companies
          </Link>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* Company hero */}
      <section className="relative overflow-hidden bg-slate-950 px-5 py-12 text-white sm:py-16">
        <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/companies"
            className="inline-flex items-center text-sm font-semibold text-blue-200 transition hover:text-white"
          >
            <span className="mr-2">←</span>
            All companies
          </Link>

          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <CompanyLogo
                company={company}
              />

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                    {company?.name ||
                      "Company"}{" "}
                    jobs
                  </h1>

                  {company?.type && (
                    <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-200">
                      {company.type}
                    </span>
                  )}
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {companyDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-300">
                  {company?.industry && (
                    <span>
                      🏢 {company.industry}
                    </span>
                  )}

                  {company?.location && (
                    <span>
                      📍 {company.location}
                    </span>
                  )}

                  {company?.size && (
                    <span>
                      👥 {company.size}
                    </span>
                  )}

                  {company?.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-300 transition hover:text-white"
                    >
                      🌐 Company website
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur-sm">
                <strong className="block text-4xl font-black text-blue-300">
                  {jobCount}
                </strong>

                <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                  {jobCount === 1
                    ? "Open position"
                    : "Open positions"}
                </span>
              </div>

              {company?.rating && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center backdrop-blur-sm">
                  <strong className="block text-4xl font-black text-amber-300">
                    {Number(
                      company.rating
                    ).toFixed(1)}
                  </strong>

                  <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                    Company rating
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Search opportunities
              </p>

              <h2 className="mt-1 text-xl font-extrabold">
                Find the right role
              </h2>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start rounded-lg px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
            <FilterField
              label="Job title or skill"
              className="xl:col-span-4"
            >
              <div className="flex items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <span className="pl-3 text-slate-400">
                  🔍
                </span>

                <input
                  type="search"
                  value={filters.search}
                  onChange={(event) =>
                    updateFilter(
                      "search",
                      event.target.value
                    )
                  }
                  placeholder="React developer, designer..."
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </FilterField>

            <FilterField
              label="Location"
              className="xl:col-span-3"
            >
              <div className="flex items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <span className="pl-3 text-slate-400">
                  📍
                </span>

                <input
                  type="search"
                  value={
                    filters.location
                  }
                  onChange={(event) =>
                    updateFilter(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="Berlin, Hamburg..."
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </FilterField>

            <FilterField
              label="Job type"
              className="xl:col-span-2"
            >
              <select
                value={filters.jobType}
                onChange={(event) =>
                  updateFilter(
                    "jobType",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {JOB_TYPES.map(
                  (jobType) => (
                    <option
                      key={jobType}
                      value={jobType}
                    >
                      {jobType === "All"
                        ? "All job types"
                        : jobType}
                    </option>
                  )
                )}
              </select>
            </FilterField>

            <FilterField
              label="Experience"
              className="xl:col-span-2"
            >
              <select
                value={
                  filters.experience
                }
                onChange={(event) =>
                  updateFilter(
                    "experience",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {EXPERIENCE_LEVELS.map(
                  (experience) => (
                    <option
                      key={experience}
                      value={experience}
                    >
                      {experience === "All"
                        ? "All levels"
                        : experience}
                    </option>
                  )
                )}
              </select>
            </FilterField>

            <FilterField
              label="Sort"
              className="xl:col-span-1"
            >
              <select
                value={filters.sort}
                onChange={(event) =>
                  updateFilter(
                    "sort",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </FilterField>
          </div>
        </section>

        {/* Results heading */}
        <section className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Available opportunities
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {jobCount}{" "}
              {jobCount === 1
                ? "job found"
                : "jobs found"}
            </h2>
          </div>

          {hasActiveFilters && (
            <p className="text-sm text-slate-500">
              Results match your selected
              filters
            </p>
          )}
        </section>

        {/* Jobs */}
        <div className="mt-5 space-y-4">
          {jobCount === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-3xl">
                💼
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-950">
                No matching jobs found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no jobs
                matching these filters. Try
                changing the job type,
                location or search keyword.
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Clear all filters
                </button>
              ) : (
                <Link
                  to="/companies"
                  className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Explore other companies
                </Link>
              )}
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                company={company}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}