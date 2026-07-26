import { useEffect, useState } from "react";
import {
  fetchJobs,
  applyForJob,
  checkApplicationStatus,
} from "../services/api";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function getStoredToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

export default function JobDetailsPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [applicationState, setApplicationState] =
    useState({
      applied: false,
      status: null,
      loading: false,
      error: "",
    });

  const token = getStoredToken();
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    async function loadJobDetails() {
      try {
        setLoading(true);
        setPageError("");

        const response = await fetchJobs();

        const allJobs = Array.isArray(response)
          ? response
          : response?.jobs || [];

        const foundJob = allJobs.find(
          (currentJob) =>
            String(currentJob._id) === String(jobId)
        );

        setJob(foundJob || null);

        if (foundJob && isLoggedIn) {
          try {
            const statusResponse =
              await checkApplicationStatus(
                foundJob._id
              );

            setApplicationState({
              applied: Boolean(
                statusResponse.applied
              ),

              status:
                statusResponse.application
                  ?.status || null,

              loading: false,
              error: "",
            });
          } catch (statusError) {
            console.error(
              "Failed to check application status:",
              statusError
            );

            setApplicationState({
              applied: false,
              status: null,
              loading: false,
              error: "",
            });
          }
        }
      } catch (error) {
        console.error(
          "Failed to load job details:",
          error
        );

        setPageError(
          error.message ||
            "Failed to load job details."
        );

        setJob(null);
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId, isLoggedIn]);

  async function handleOneClickApply() {
    if (!job) {
      return;
    }

    if (!isLoggedIn) {
      navigate("/Login", {
        state: {
          from: location.pathname,
          message:
            "Please log in before applying for this job.",
        },
      });

      return;
    }

    if (
      applicationState.applied ||
      applicationState.loading
    ) {
      return;
    }

    setApplicationState((current) => ({
      ...current,
      loading: true,
      error: "",
    }));

    try {
      const response = await applyForJob(
        job._id
      );

      setApplicationState({
        applied: true,

        status:
          response.application?.status ||
          "Submitted",

        loading: false,
        error: "",
      });
    } catch (error) {
      console.error(
        "One-click application failed:",
        error
      );

      if (error.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/Login", {
          state: {
            from: location.pathname,
            message:
              "Your session has expired. Please log in again.",
          },
        });

        return;
      }

      if (error.status === 409) {
        setApplicationState({
          applied: true,

          status:
            error.data?.application?.status ||
            "Submitted",

          loading: false,
          error: "",
        });

        return;
      }

      setApplicationState((current) => ({
        ...current,
        loading: false,

        error:
          error.message ||
          "Unable to submit your application.",
      }));
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFF] text-sm font-bold text-blue-700">
        Loading job specifications...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7FAFF] p-5 text-center">
        <span className="mb-2 text-4xl">
          🕵️‍♂️
        </span>

        <h3 className="font-serif text-lg font-bold text-[#07192E]">
          Position Not Found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {pageError ||
            "This listing may have expired or been filled."}
        </p>
      </div>
    );
  }

  const typeClass = {
    "Full Time":
      "border-blue-200 bg-blue-50 text-blue-700",

    Remote:
      "border-green-200 bg-green-50 text-green-700",

    Hybrid:
      "border-amber-200 bg-amber-50 text-amber-700",

    "Part Time":
      "border-purple-200 bg-purple-50 text-purple-700",

    Internship:
      "border-pink-200 bg-pink-50 text-pink-700",
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] font-['Segoe_UI',system-ui,sans-serif] text-[#07192E]">
      {/* Job header */}
      <section className="bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                typeClass[job.type] ||
                "border-white/20 bg-white/10 text-white"
              }`}
            >
              {job.type}
            </span>

            {job.category && (
              <span className="rounded-full border border-blue-700/30 bg-blue-900/40 px-3 py-1 text-xs font-semibold text-blue-200">
                {job.category}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {job.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-white/80">
            <span>
              🏢{" "}
              <strong className="text-white">
                {job.company}
              </strong>
            </span>

            <span>
              📍 {job.loc || "Location not specified"}
            </span>

            <span>
              💰{" "}
              <strong className="text-blue-300">
                {job.sal ||
                  "Salary not specified"}
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_340px] lg:px-12">
        {/* Job information */}
        <div className="flex flex-col gap-8 rounded-2xl border border-[#DDEAFC] bg-white p-6 shadow-[0_2px_10px_rgba(10,30,60,0.02)] sm:p-8">
          <div>
            <h2 className="mb-3 font-serif text-xl font-bold text-[#07192E]">
              Role Overview
            </h2>

            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
              {job.description ||
                "No specific description has been provided for this job opening."}
            </p>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="mb-3 font-serif text-xl font-bold text-[#07192E]">
              Core Prerequisites & Requirements
            </h2>

            {Array.isArray(job.requirements) &&
            job.requirements.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {job.requirements.map(
                  (requirement, index) => (
                    <li
                      key={`${requirement}-${index}`}
                      className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-1 shrink-0 text-xs text-blue-500">
                        ⚡
                      </span>

                      <span>{requirement}</span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-sm italic text-slate-400">
                No specific requirements have been
                provided.
              </p>
            )}
          </div>
        </div>

        {/* One-click application box */}
        <aside className="sticky top-6 h-fit rounded-2xl border border-[#DDEAFC] bg-white p-6 shadow-[0_4px_20px_rgba(7,25,46,0.04)]">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-extrabold"
              style={{
                backgroundColor: `${
                  job.lc || "#1565C0"
                }18`,

                borderColor: `${
                  job.lc || "#1565C0"
                }30`,

                color: job.lc || "#1565C0",
              }}
            >
              {job.logo || "💼"}
            </div>

            <div className="min-w-0">
              <h3 className="max-w-[180px] truncate font-serif text-sm font-bold text-[#07192E]">
                {job.company}
              </h3>

              <p className="text-xs text-slate-400">
                Active hiring partner
              </p>
            </div>
          </div>

          {applicationState.error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
              {applicationState.error}
            </div>
          )}

          {applicationState.applied ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <span className="mb-1 block text-2xl">
                🎉
              </span>

              <h4 className="text-sm font-bold text-green-800">
                Application Submitted!
              </h4>

              <p className="mt-1 text-xs text-green-600">
                Your saved profile and CV details
                have been sent to the recruiter.
              </p>

              {applicationState.status && (
                <p className="mt-3 text-xs text-green-700">
                  Current status:{" "}
                  <span className="font-bold">
                    {applicationState.status}
                  </span>
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate("/my-applications")
                }
                className="mt-4 w-full rounded-xl border border-green-300 bg-white px-4 py-3 text-xs font-bold text-green-700 transition hover:bg-green-100"
              >
                View My Applications
              </button>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Application
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Apply instantly using the personal
                information and CV already saved in
                your profile.
              </p>

              {!isLoggedIn && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                  You must log in before applying
                  for this position.
                </div>
              )}

              <button
                type="button"
                onClick={handleOneClickApply}
                disabled={
                  applicationState.loading
                }
                className="mt-5 w-full rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(21,101,192,0.2)] transition-opacity hover:opacity-95 disabled:cursor-wait disabled:opacity-50"
              >
                {applicationState.loading
                  ? "Applying..."
                  : isLoggedIn
                    ? "⚡ One-Click Apply"
                    : "Log In to Apply"}
              </button>

              <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
                No manual form is required. Your
                stored profile details will be sent
                directly to the verified employer.
              </p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}