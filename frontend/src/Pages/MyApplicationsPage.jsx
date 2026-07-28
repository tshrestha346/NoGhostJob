import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  fetchMyApplications,
} from "../services/api";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getCompanyName(
  job,
  jobSnapshot
) {
  if (
    job?.company &&
    typeof job.company === "object"
  ) {
    return (
      job.company.name ||
      job.company.initials ||
      "Company not specified"
    );
  }

  if (
    typeof job?.company === "string"
  ) {
    return job.company;
  }

  if (
    typeof jobSnapshot?.companyName ===
    "string"
  ) {
    return jobSnapshot.companyName;
  }

  if (
    typeof jobSnapshot?.company ===
    "string"
  ) {
    return jobSnapshot.company;
  }

  if (
    jobSnapshot?.company &&
    typeof jobSnapshot.company ===
      "object"
  ) {
    return (
      jobSnapshot.company.name ||
      jobSnapshot.company.initials ||
      "Company not specified"
    );
  }

  return "Company not specified";
}

function getCompanyLogo(job) {
  if (
    job?.company &&
    typeof job.company === "object"
  ) {
    return (
      job.company.logo ||
      job.company.initials ||
      job.logo ||
      "💼"
    );
  }

  return job?.logo || "💼";
}

function getJobLocation(
  job,
  jobSnapshot
) {
  return (
    job?.loc ||
    job?.location ||
    job?.company?.location ||
    jobSnapshot?.location ||
    "Location not specified"
  );
}

function getJobType(
  job,
  jobSnapshot
) {
  return (
    job?.type ||
    job?.jobType ||
    jobSnapshot?.type ||
    "Not specified"
  );
}

function formatApplicationDate(
  value
) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Unknown date";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default function MyApplicationsPage() {
  const navigate = useNavigate();

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      try {
        setLoading(true);
        setError("");

        const data =
          await fetchMyApplications();

        if (active) {
          setApplications(
            Array.isArray(data)
              ? data
              : Array.isArray(
                    data?.applications
                  )
                ? data.applications
                : []
          );
        }
      } catch (loadError) {
        console.error(
          "Applications loading error:",
          loadError
        );

        if (
          loadError.status === 401
        ) {
          navigate("/Login", {
            state: {
              from:
                "/my-applications",

              message:
                "Please log in to view your applications.",
            },
          });

          return;
        }

        if (active) {
          setError(
            loadError.message ||
              "Unable to load applications."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      active = false;
    };
  }, [navigate]);

  const statusClasses = {
    Submitted:
      "bg-blue-50 text-blue-700 border-blue-200",

    "Under Review":
      "bg-amber-50 text-amber-700 border-amber-200",

    Shortlisted:
      "bg-purple-50 text-purple-700 border-purple-200",

    Interview:
      "bg-indigo-50 text-indigo-700 border-indigo-200",

    Rejected:
      "bg-red-50 text-red-700 border-red-200",

    Hired:
      "bg-green-50 text-green-700 border-green-200",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFF] text-sm font-bold text-blue-700">
        Loading your applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFF] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[1.4px] text-blue-600">
            Career Dashboard
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold text-[#07192E]">
            My Applications
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track all jobs you have
            applied for.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-[#DDEAFC] bg-white p-10 text-center">
            <span className="text-5xl">
              📄
            </span>

            <h2 className="mt-4 font-serif text-xl font-bold text-[#07192E]">
              No Applications Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start exploring jobs and
              apply with one click.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {applications.map(
              (application) => {
                const job =
                  application?.job &&
                  typeof application.job ===
                    "object"
                    ? application.job
                    : {};

                const jobSnapshot =
                  application?.jobSnapshot ||
                  {};

                const companyName =
                  getCompanyName(
                    job,
                    jobSnapshot
                  );

                const companyLogo =
                  getCompanyLogo(job);

                const jobLocation =
                  getJobLocation(
                    job,
                    jobSnapshot
                  );

                const jobType =
                  getJobType(
                    job,
                    jobSnapshot
                  );

                const jobTitle =
                  job?.title ||
                  jobSnapshot?.title ||
                  "Job unavailable";

                const jobId =
                  job?._id ||
                  (typeof application?.job ===
                  "string"
                    ? application.job
                    : "");

                const isRejected =
                  application?.status ===
                  "Rejected";

                const rejectionReason =
                  application?.rejectionReason ||
                  "";

                return (
                  <article
                    key={
                      application?._id ||
                      `${jobId}-${application?.createdAt}`
                    }
                    className="rounded-2xl border border-[#DDEAFC] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border text-sm font-bold"
                          style={{
                            backgroundColor: `${
                              job?.lc ||
                              "#1565C0"
                            }18`,

                            borderColor: `${
                              job?.lc ||
                              "#1565C0"
                            }30`,

                            color:
                              job?.lc ||
                              "#1565C0",
                          }}
                        >
                          {typeof companyLogo ===
                            "string" &&
                          companyLogo.startsWith(
                            "http"
                          ) ? (
                            <img
                              src={
                                companyLogo
                              }
                              alt={
                                companyName
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            companyLogo
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate font-serif text-lg font-bold text-[#07192E]">
                            {jobTitle}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {companyName}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                            <span>
                              📍{" "}
                              {
                                jobLocation
                              }
                            </span>

                            <span>
                              🕒{" "}
                              {jobType}
                            </span>

                            {job?.company
                              ?.industry && (
                              <span>
                                🏢{" "}
                                {
                                  job
                                    .company
                                    .industry
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            statusClasses[
                              application
                                ?.status
                            ] ||
                            "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {application?.status ||
                            "Submitted"}
                        </span>

                        <p className="text-xs text-slate-400">
                          Applied{" "}
                          {formatApplicationDate(
                            application?.appliedAt ||
                              application?.createdAt
                          )}
                        </p>

                        {jobId && (
                          <Link
                            to={`/jobs/${jobId}`}
                            className="text-xs font-bold text-blue-700 hover:underline"
                          >
                            View Job
                          </Link>
                        )}
                      </div>
                    </div>

                    {isRejected &&
                      rejectionReason && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">
                            Reason for rejection
                          </p>

                          <p className="mt-1 text-sm leading-relaxed text-red-700">
                            {
                              rejectionReason
                            }
                          </p>
                        </div>
                      )}
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}