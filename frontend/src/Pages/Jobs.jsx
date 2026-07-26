import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  fetchJobs,
  fetchCategories,
  applyForJob,
  checkApplicationStatus,
} from "../services/api";

function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function getJobLocation(job) {
  return job?.loc || job?.location || job?.city || "Location not specified";
}

function getJobCompany(job) {
  if (typeof job?.company === "string") {
    return job.company;
  }

  return job?.company?.name || job?.companyName || "Company not specified";
}

function getJobCategory(job) {
  if (typeof job?.category === "string") {
    return job.category;
  }

  return job?.category?.name || job?.categoryName || "Uncategorised";
}

function getCategoryName(category) {
  if (typeof category === "string") {
    return category;
  }

  return category?.name || category?.title || "";
}

function getJobType(job) {
  return job?.type || job?.jobType || job?.employmentType || "Other";
}

function getJobSalary(job) {
  return job?.sal || job?.salary || job?.salaryRange || "Salary not specified";
}

function getRequirements(job) {
  if (Array.isArray(job?.requirements)) {
    return job.requirements;
  }

  if (typeof job?.requirements === "string") {
    return job.requirements
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function isFeaturedJob(job) {
  return job?.isFeatured === true || job?.featured === true;
}

function SectionLabel({ children }) {
  return (
    <span className="mb-3.5 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.3px] text-blue-700">
      {children}
    </span>
  );
}

function JobCard({ job, applicationState, onApply }) {
  const applicationInfo = applicationState || {
    applied: false,
    status: null,
    loading: false,
    error: "",
  };

  const jobType = getJobType(job);
  const requirements = getRequirements(job);

  const typeClass = {
    "Full Time": "border-blue-200 bg-blue-50 text-blue-700",
    "Full-Time": "border-blue-200 bg-blue-50 text-blue-700",
    Remote: "border-green-200 bg-green-50 text-green-700",
    Hybrid: "border-amber-200 bg-amber-50 text-amber-700",
    "Part Time": "border-purple-200 bg-purple-50 text-purple-700",
    "Part-Time": "border-purple-200 bg-purple-50 text-purple-700",
    Internship: "border-pink-200 bg-pink-50 text-pink-700",
  };

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white p-5 shadow-[0_2px_10px_rgba(10,30,60,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_12px_40px_rgba(21,101,192,0.13)]">
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
              {job.title || "Untitled position"}
            </h3>

            {isFeaturedJob(job) && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                Featured
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-slate-500">
            🏢 {getJobCompany(job)} · 📍 {getJobLocation(job)}
          </p>
        </div>
      </div>

      {job.description && (
        <p className="line-clamp-2 text-xs leading-5 text-slate-600">
          {job.description}
        </p>
      )}

      {requirements.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {requirements.slice(0, 2).map((requirement, index) => (
            <span
              key={`${requirement}-${index}`}
              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
            >
              {requirement}
            </span>
          ))}

          {requirements.length > 2 && (
            <span className="self-center text-[10px] text-slate-400">
              +{requirements.length - 2} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-bold text-blue-700">
          {getJobSalary(job)}
        </span>

        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
            typeClass[jobType] || "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {jobType}
        </span>
      </div>

      {applicationInfo.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
          {applicationInfo.error}
        </div>
      )}

      {applicationInfo.applied && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          <p className="font-bold">✓ Application submitted</p>
          {applicationInfo.status && (
            <p className="mt-1">
              Status: <span className="font-semibold">{applicationInfo.status}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link
          to={`/jobs/${job._id}`}
          className="rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-center text-xs font-bold text-blue-700 transition hover:bg-blue-50"
        >
          View Details
        </Link>

        <button
          type="button"
          onClick={() => onApply(job)}
          disabled={applicationInfo.loading || applicationInfo.applied}
          className={`rounded-lg px-3 py-2.5 text-xs font-bold text-white transition ${
            applicationInfo.applied
              ? "cursor-not-allowed bg-green-600"
              : applicationInfo.loading
                ? "cursor-wait bg-blue-400"
                : "bg-gradient-to-br from-blue-700 to-blue-400 hover:opacity-90"
          }`}
        >
          {applicationInfo.loading
            ? "Applying..."
            : applicationInfo.applied
              ? "✓ Applied"
              : "⚡ One-Click Apply"}
        </button>
      </div>
    </article>
  );
}

export default function JobsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const initialKeyword = urlParams.get("keyword") || "";
  const initialLocation = urlParams.get("location") || "";

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [applicationStates, setApplicationStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  // Text currently entered by the user.
  const [keywordInput, setKeywordInput] = useState(initialKeyword);
  const [locationInput, setLocationInput] = useState(initialLocation);

  // Text actually being used by the search after form submission.
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [searchLocation, setSearchLocation] = useState(initialLocation);

  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const token = getStoredToken();
  const isLoggedIn = Boolean(token);

  async function loadApplicationStatuses(loadedJobs) {
    if (!isLoggedIn) {
      setApplicationStates({});
      return;
    }

    const initialStates = {};

    loadedJobs.forEach((job) => {
      if (!job?._id) return;

      initialStates[job._id] = {
        applied: false,
        status: null,
        loading: false,
        error: "",
      };
    });

    setApplicationStates(initialStates);

    const statusResults = await Promise.allSettled(
      loadedJobs
        .filter((job) => job?._id)
        .map(async (job) => {
          const response = await checkApplicationStatus(job._id);

          return {
            jobId: job._id,
            applied: Boolean(response?.applied),
            status: response?.application?.status || null,
          };
        })
    );

    setApplicationStates((current) => {
      const updated = { ...current };

      statusResults.forEach((result) => {
        if (result.status !== "fulfilled") return;

        const { jobId, applied, status } = result.value;

        updated[jobId] = {
          applied,
          status,
          loading: false,
          error: "",
        };
      });

      return updated;
    });
  }

  async function loadJobsData() {
    try {
      setLoading(true);
      setPageError("");

      // Load the complete list once. All search and filter options are then
      // applied consistently on the client side.
      const [jobsResponse, categoriesResponse] = await Promise.all([
        fetchJobs("", ""),
        fetchCategories(),
      ]);

      const loadedJobs = Array.isArray(jobsResponse)
        ? jobsResponse
        : Array.isArray(jobsResponse?.jobs)
          ? jobsResponse.jobs
          : [];

      const loadedCategories = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : Array.isArray(categoriesResponse?.categories)
          ? categoriesResponse.categories
          : [];

      setJobs(loadedJobs);
      setCategories(loadedCategories);

      await loadApplicationStatuses(loadedJobs);
    } catch (error) {
      console.error("Failed to load jobs data:", error);
      setJobs([]);
      setCategories([]);
      setPageError(error.message || "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextKeyword = params.get("keyword") || "";
    const nextLocation = params.get("location") || "";

    setKeywordInput(nextKeyword);
    setLocationInput(nextLocation);
    setSearchKeyword(nextKeyword);
    setSearchLocation(nextLocation);
  }, [location.search]);

  function handleSearch(event) {
    event.preventDefault();
    setPageError("");

    const cleanKeyword = keywordInput.trim();
    const cleanLocation = locationInput.trim();

    setSearchKeyword(cleanKeyword);
    setSearchLocation(cleanLocation);

    const params = new URLSearchParams();
    if (cleanKeyword) params.set("keyword", cleanKeyword);
    if (cleanLocation) params.set("location", cleanLocation);

    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true }
    );
  }

  function handleResetFilters() {
    setKeywordInput("");
    setLocationInput("");
    setSearchKeyword("");
    setSearchLocation("");
    setSelectedType("All");
    setSelectedCategory("All");
    setFeaturedOnly(false);
    setPageError("");

    navigate(
      { pathname: location.pathname, search: "" },
      { replace: true }
    );
  }

  async function handleOneClickApply(job) {
    if (!isLoggedIn) {
      navigate("/Login", {
        state: {
          from: location.pathname,
          message: "Please log in before applying for a job.",
        },
      });
      return;
    }

    const currentState = applicationStates[job._id];

    if (currentState?.applied || currentState?.loading) {
      return;
    }

    setApplicationStates((current) => ({
      ...current,
      [job._id]: {
        ...current[job._id],
        applied: false,
        loading: true,
        error: "",
      },
    }));

    try {
      const response = await applyForJob(job._id);

      setApplicationStates((current) => ({
        ...current,
        [job._id]: {
          applied: true,
          status: response?.application?.status || "Submitted",
          loading: false,
          error: "",
        },
      }));
    } catch (error) {
      console.error("One-click application failed:", error);

      if (error.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/Login", {
          state: {
            from: location.pathname,
            message: "Your session has expired. Please log in again.",
          },
        });
        return;
      }

      if (error.status === 409) {
        setApplicationStates((current) => ({
          ...current,
          [job._id]: {
            applied: true,
            status: error.data?.application?.status || "Submitted",
            loading: false,
            error: "",
          },
        }));
        return;
      }

      setApplicationStates((current) => ({
        ...current,
        [job._id]: {
          ...current[job._id],
          applied: false,
          loading: false,
          error: error.message || "Unable to submit application.",
        },
      }));
    }
  }

  const categoryOptions = useMemo(() => {
    const names = new Set();

    categories.forEach((category) => {
      const name = getCategoryName(category);
      if (name) names.add(name);
    });

    jobs.forEach((job) => {
      const name = getJobCategory(job);
      if (name && name !== "Uncategorised") names.add(name);
    });

    return [...names].sort((a, b) => a.localeCompare(b));
  }, [categories, jobs]);

  const jobTypeOptions = useMemo(() => {
    const types = new Set(
      jobs.map((job) => getJobType(job)).filter((type) => type && type !== "Other")
    );

    return ["All", ...[...types].sort((a, b) => a.localeCompare(b))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const keyword = normalizeText(searchKeyword);
    const locationQuery = normalizeText(searchLocation);
    const selectedTypeValue = normalizeText(selectedType);
    const selectedCategoryValue = normalizeText(selectedCategory);

    return jobs.filter((job) => {
      const requirements = getRequirements(job);

      const searchableText = normalizeText(
        [
          job?.title,
          getJobCompany(job),
          job?.description,
          getJobCategory(job),
          getJobType(job),
          getJobLocation(job),
          requirements.join(" "),
          Array.isArray(job?.skills) ? job.skills.join(" ") : job?.skills,
        ].join(" ")
      );

      const jobLocation = normalizeText(getJobLocation(job));
      const jobType = normalizeText(getJobType(job));
      const jobCategory = normalizeText(getJobCategory(job));

      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesLocation =
        !locationQuery || jobLocation.includes(locationQuery);
      const matchesType =
        selectedType === "All" || jobType === selectedTypeValue;
      const matchesCategory =
        selectedCategory === "All" || jobCategory === selectedCategoryValue;
      const matchesFeatured = !featuredOnly || isFeaturedJob(job);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesCategory &&
        matchesFeatured
      );
    });
  }, [
    jobs,
    searchKeyword,
    searchLocation,
    selectedType,
    selectedCategory,
    featuredOnly,
  ]);

  const hasActiveFilters = Boolean(
    searchKeyword ||
      searchLocation ||
      selectedType !== "All" ||
      selectedCategory !== "All" ||
      featuredOnly
  );

  return (
    <div className="min-h-screen bg-[#F7FAFF] font-['Segoe_UI',system-ui,sans-serif] text-[#07192E]">
      <section className="bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-5 py-12 text-center sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionLabel>Live Marketplace</SectionLabel>

          <h1 className="mb-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Explore Open Positions
          </h1>

          <p className="mx-auto max-w-xl text-sm text-white/70">
            Ditch the ghost listings. Connect with active job opportunities
            matching your skills.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <form
          onSubmit={handleSearch}
          className="mb-8 grid gap-2 rounded-2xl border border-[#DDEAFC] bg-white p-3 shadow-[0_10px_30px_rgba(7,25,46,0.04)] md:grid-cols-[1fr_1fr_auto] md:gap-0"
        >
          <div className="relative md:border-r md:border-[#DDEAFC]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
            <input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="Title, company, skill, keyword..."
              className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm outline-none"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">📍</span>
            <input
              value={locationInput}
              onChange={(event) => setLocationInput(event.target.value)}
              placeholder="City, country, Remote..."
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

        {pageError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {pageError}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#DDEAFC] bg-white p-6 shadow-[0_2px_10px_rgba(10,30,60,0.02)]">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-serif text-base font-bold">Filter Options</h2>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Listing Type
              </label>

              <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(event) => setFeaturedOnly(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Featured Only
              </label>
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Arrangement
              </label>

              <div className="flex flex-col gap-1">
                {jobTypeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-all ${
                      selectedType === type
                        ? "bg-blue-50 font-bold text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Category Sector
              </label>

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full rounded-xl border border-[#DDEAFC] bg-white p-3 text-sm outline-none focus:border-blue-400"
              >
                <option value="All">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {isLoggedIn && (
              <Link
                to="/my-applications"
                className="mt-6 block rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                View My Applications
              </Link>
            )}
          </aside>

          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-[#07192E]">
                  {filteredJobs.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#07192E]">{jobs.length}</span>{" "}
                active job records
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                >
                  Clear search and filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-dashed border-[#DDEAFC] bg-white text-sm font-bold text-blue-700">
                Loading Jobs...
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    applicationState={applicationStates[job._id]}
                    onApply={handleOneClickApply}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#DDEAFC] bg-white py-20 text-center">
                <span className="mb-3 block text-3xl">📭</span>
                <h3 className="font-serif text-lg font-bold">
                  No listings matched
                </h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-slate-400">
                  Try another keyword, location, category, or job arrangement.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}