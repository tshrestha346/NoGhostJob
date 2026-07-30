import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteJob,
  updateJobStatus,
  getApplicationsForJob,
} from "../Employer/employerApi";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getJobId(job) {
  return job?._id || job?.id || null;
}

function getText(value, fallback = "") {
  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (value && typeof value === "object") {
    return (
      value.name ||
      value.title ||
      value.companyName ||
      fallback
    );
  }

  return fallback;
}

function extractApplications(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.applications)) {
    return response.applications;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.applications)) {
    return response.data.applications;
  }

  return [];
}

function getJobStatus(job) {
  if (job?.status) {
    const status = String(job.status)
      .trim()
      .toLowerCase();

    if (status === "active") {
      return "Active";
    }

    if (
      status === "closed" ||
      status === "inactive"
    ) {
      return "Closed";
    }

    if (status === "draft") {
      return "Draft";
    }
  }

  if (
    job?.is_active === true ||
    job?.isActive === true
  ) {
    return "Active";
  }

  if (
    job?.is_active === false ||
    job?.isActive === false
  ) {
    return "Closed";
  }

  return "Draft";
}

function getJobDisplayData(
  job,
  applicantCount = 0
) {
  return {
    id: getJobId(job),

    title: getText(
      job?.title || job?.jobTitle,
      "Untitled Job"
    ),

    department: getText(
      job?.department || job?.dept,
      "Department not specified"
    ),

    type: getText(
      job?.type ||
        job?.jobType ||
        job?.employmentType,
      "Job type not specified"
    ),

    location: getText(
      job?.loc ||
        job?.location ||
        job?.jobLocation,
      "Location not specified"
    ),

    salary: getText(
      job?.sal ||
        job?.salary ||
        job?.salaryRange,
      "Salary not specified"
    ),

    applicants: applicantCount,

    status: getJobStatus(job),

    posted:
      job?.posted ||
      job?.createdAt ||
      job?.postedAt ||
      null,

    featured: Boolean(
      job?.isFeatured ||
        job?.featured
    ),
  };
}

function formatPostedDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/*
|--------------------------------------------------------------------------
| Status badge
|--------------------------------------------------------------------------
*/

function JobStatusBadge({ status }) {
  const statusClasses = {
    Active:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    Closed:
      "border-red-200 bg-red-50 text-red-700",

    Draft:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  const dotClasses = {
    Active: "bg-emerald-500",
    Closed: "bg-red-500",
    Draft: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        statusClasses[status] ||
        statusClasses.Draft
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dotClasses[status] ||
          dotClasses.Draft
        }`}
      />

      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Applicant metric
|--------------------------------------------------------------------------
*/

function ApplicantMetric({
  count,
  loading,
}) {
  return (
    <div className="flex min-w-[145px] items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
      <span className="text-lg">
        👥
      </span>

      <div>
        {loading ? (
          <div className="h-5 w-8 animate-pulse rounded bg-blue-200" />
        ) : (
          <div className="text-lg font-extrabold leading-none text-blue-700">
            {count.toLocaleString("en-GB")}
          </div>
        )}

        <div className="mt-1 text-[11px] font-medium text-slate-500">
          {count === 1
            ? "Applicant"
            : "Applicants"}
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

export default function JobListings({
  jobs = [],
  setJobs,
  setPage,
  setPostEditJob,
  onViewApplicants,
  onRefresh,
}) {
  const [busyId, setBusyId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  /*
   * Stores applicant totals using:
   *
   * {
   *   jobId: number
   * }
   */
  const [
    applicantCounts,
    setApplicantCounts,
  ] = useState({});

  const [
    loadingApplicantCounts,
    setLoadingApplicantCounts,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch applicant count for every job
  |--------------------------------------------------------------------------
  */

  const loadApplicantCounts = async () => {
    const jobsWithIds = jobs.filter(
      (job) => getJobId(job)
    );

    if (jobsWithIds.length === 0) {
      setApplicantCounts({});
      return;
    }

    try {
      setLoadingApplicantCounts(true);

      const results =
        await Promise.allSettled(
          jobsWithIds.map(async (job) => {
            const jobId = getJobId(job);

            const response =
              await getApplicationsForJob(
                jobId
              );

            const applications =
              extractApplications(response);

            return {
              jobId: String(jobId),
              count: applications.length,
            };
          })
        );

      const nextCounts = {};

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          nextCounts[
            result.value.jobId
          ] = result.value.count;
        } else {
          console.error(
            "Failed to load applications for a job:",
            result.reason
          );
        }
      });

      setApplicantCounts(nextCounts);
    } catch (loadError) {
      console.error(
        "Failed to load applicant counts:",
        loadError
      );

      setError(
        loadError?.response?.data?.message ||
          loadError?.data?.message ||
          loadError?.message ||
          "Applicant counts could not be loaded."
      );
    } finally {
      setLoadingApplicantCounts(false);
    }
  };

  useEffect(() => {
    loadApplicantCounts();
  }, [jobs]);

  /*
  |--------------------------------------------------------------------------
  | Normalise jobs
  |--------------------------------------------------------------------------
  */

  const formattedJobs = useMemo(() => {
    return jobs.map((job) => {
      const jobId = getJobId(job);

      const applicantCount = jobId
        ? applicantCounts[
            String(jobId)
          ] ?? 0
        : 0;

      return {
        original: job,

        ...getJobDisplayData(
          job,
          applicantCount
        ),
      };
    });
  }, [jobs, applicantCounts]);

  /*
  |--------------------------------------------------------------------------
  | Filter jobs
  |--------------------------------------------------------------------------
  */

  const filteredJobs = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return formattedJobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title
          .toLowerCase()
          .includes(search) ||
        job.department
          .toLowerCase()
          .includes(search) ||
        job.location
          .toLowerCase()
          .includes(search) ||
        job.type
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    formattedJobs,
    searchTerm,
    statusFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Real dashboard statistics
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const totalApplicants =
      formattedJobs.reduce(
        (total, job) =>
          total + job.applicants,
        0
      );

    return {
      total: formattedJobs.length,

      active: formattedJobs.filter(
        (job) =>
          job.status === "Active"
      ).length,

      closed: formattedJobs.filter(
        (job) =>
          job.status === "Closed"
      ).length,

      applicants: totalApplicants,
    };
  }, [formattedJobs]);

  /*
  |--------------------------------------------------------------------------
  | Delete job
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (job) => {
    if (!job.id) {
      setError(
        "This job does not have a valid ID."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${job.title}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setBusyId(job.id);
      setError("");

      await deleteJob(job.id);

      if (typeof setJobs === "function") {
        setJobs((currentJobs) =>
          currentJobs.filter(
            (currentJob) =>
              String(
                getJobId(currentJob)
              ) !== String(job.id)
          )
        );
      }

      setApplicantCounts(
        (currentCounts) => {
          const updatedCounts = {
            ...currentCounts,
          };

          delete updatedCounts[
            String(job.id)
          ];

          return updatedCounts;
        }
      );
    } catch (deleteError) {
      console.error(
        "Failed to delete job:",
        deleteError
      );

      setError(
        deleteError?.response?.data?.message ||
          deleteError?.data?.message ||
          deleteError?.message ||
          "The job could not be deleted."
      );
    } finally {
      setBusyId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle status
  |--------------------------------------------------------------------------
  */

  const handleToggleStatus = async (
    job
  ) => {
    if (!job.id) {
      setError(
        "This job does not have a valid ID."
      );

      return;
    }

    const nextStatus =
      job.status === "Active"
        ? "Closed"
        : "Active";

    try {
      setBusyId(job.id);
      setError("");

      await updateJobStatus(
        job.id,
        nextStatus
      );

      if (typeof setJobs === "function") {
        setJobs((currentJobs) =>
          currentJobs.map(
            (currentJob) => {
              const currentJobId =
                getJobId(currentJob);

              if (
                String(currentJobId) !==
                String(job.id)
              ) {
                return currentJob;
              }

              return {
                ...currentJob,

                status: nextStatus,

                is_active:
                  nextStatus === "Active",

                isActive:
                  nextStatus === "Active",
              };
            }
          )
        );
      }
    } catch (statusError) {
      console.error(
        "Failed to update status:",
        statusError
      );

      setError(
        statusError?.response?.data?.message ||
          statusError?.data?.message ||
          statusError?.message ||
          "The job status could not be updated."
      );
    } finally {
      setBusyId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Actions
  |--------------------------------------------------------------------------
  */

  const handleEdit = (job) => {
    if (
      typeof setPostEditJob ===
      "function"
    ) {
      setPostEditJob(job.original);
    }

    if (
      typeof setPage === "function"
    ) {
      setPage("post");
    }
  };

  const handleViewApplicants = (
    job
  ) => {
    if (
      typeof onViewApplicants ===
      "function"
    ) {
      onViewApplicants(job.original);
    }
  };

  const handlePostNewJob = () => {
    if (
      typeof setPostEditJob ===
      "function"
    ) {
      setPostEditJob(null);
    }

    if (
      typeof setPage === "function"
    ) {
      setPage("post");
    }
  };

  const handleRefresh = async () => {
    try {
      setError("");

      if (
        typeof onRefresh === "function"
      ) {
        await onRefresh();
      }

      await loadApplicantCounts();
    } catch (refreshError) {
      setError(
        refreshError?.message ||
          "The job listings could not be refreshed."
      );
    }
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">
              Employer Dashboard
            </span>

            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Job Listings
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage the jobs posted by your
              company and review applications
              received for each position.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePostNewJob}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:from-blue-800 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Post New Job
          </button>
        </header>

        {/* Statistics */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Jobs
            </p>

            <div className="mt-3 flex items-end justify-between">
              <span className="font-serif text-3xl font-extrabold text-slate-950">
                {statistics.total}
              </span>

              <span className="text-2xl">
                💼
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Active Jobs
            </p>

            <div className="mt-3 flex items-end justify-between">
              <span className="font-serif text-3xl font-extrabold text-emerald-700">
                {statistics.active}
              </span>

              <span className="text-2xl">
                🟢
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
              Closed Jobs
            </p>

            <div className="mt-3 flex items-end justify-between">
              <span className="font-serif text-3xl font-extrabold text-red-700">
                {statistics.closed}
              </span>

              <span className="text-2xl">
                🔴
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Total Applicants
            </p>

            <div className="mt-3 flex items-end justify-between">
              {loadingApplicantCounts ? (
                <span className="h-9 w-14 animate-pulse rounded bg-blue-200" />
              ) : (
                <span className="font-serif text-3xl font-extrabold text-blue-700">
                  {statistics.applicants}
                </span>
              )}

              <span className="text-2xl">
                👥
              </span>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">
                ⚠️
              </span>

              <div>
                <p className="font-bold">
                  Action failed
                </p>

                <p className="mt-1 leading-6">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-lg font-bold text-red-500 hover:text-red-700"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search by title, department, type, or location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="min-w-[150px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">
                All statuses
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Closed">
                Closed
              </option>

              <option value="Draft">
                Draft
              </option>
            </select>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={
                busyId !== null ||
                loadingApplicantCounts
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingApplicantCounts
                ? "Loading..."
                : "↻ Refresh"}
            </button>
          </div>
        </section>

        {/* Result information */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredJobs.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">
              {formattedJobs.length}
            </span>{" "}
            jobs
          </p>

          {(searchTerm ||
            statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Job listings */}
        <section className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const isBusy =
                String(busyId) ===
                String(job.id);

              return (
                <article
                  key={
                    job.id ||
                    `${job.title}-${job.posted}`
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      {/* Job information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="font-serif text-xl font-bold text-slate-950">
                            {job.title}
                          </h2>

                          <JobStatusBadge
                            status={job.status}
                          />

                          {job.featured && (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                              ⭐ Featured
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <span>🏢</span>
                            {job.department}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <span>🕒</span>
                            {job.type}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <span>📍</span>
                            {job.location}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <span>💰</span>
                            {job.salary}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <span>📅</span>
                            Posted{" "}
                            {formatPostedDate(
                              job.posted
                            )}
                          </span>
                        </div>

                        <div className="mt-5">
                          <ApplicantMetric
                            count={
                              job.applicants
                            }
                            loading={
                              loadingApplicantCounts
                            }
                          />
                        </div>
                      </div>

                      {/* Job actions */}
                      <div className="grid shrink-0 gap-2 sm:grid-cols-2 xl:w-[360px]">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(job)
                          }
                          disabled={isBusy}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(
                              job
                            )
                          }
                          disabled={isBusy}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            job.status ===
                            "Active"
                              ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {isBusy ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />

                              Updating
                            </>
                          ) : job.status ===
                            "Active" ? (
                            "⏸ Close Job"
                          ) : (
                            "▶ Activate"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleViewApplicants(
                              job
                            )
                          }
                          disabled={
                            isBusy ||
                            !job.id
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          👥 View Applicants
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(job)
                          }
                          disabled={isBusy}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isBusy ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-700" />

                              Please wait
                            </>
                          ) : (
                            "🗑 Delete"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : formattedJobs.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                💼
              </div>

              <h2 className="mt-5 font-serif text-2xl font-bold text-slate-950">
                No jobs posted yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Create your first job listing to
                start receiving applications from
                candidates.
              </p>

              <button
                type="button"
                onClick={handlePostNewJob}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                + Post Your First Job
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">
                🔍
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-950">
                No matching jobs found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search term or
                status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}