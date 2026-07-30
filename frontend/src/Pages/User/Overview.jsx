import { useEffect, useMemo, useState } from "react";

import {
  SectionHeader,
  StatusBadge,
} from "../../Components/User/UserSections.jsx";

import { fetchMyApplications } from "../../services/api";

/*
|--------------------------------------------------------------------------
| Status configuration
|--------------------------------------------------------------------------
*/

const PIPELINE_STATUS = {
  Applied: {
    icon: "📋",
    label: "Applied",
    textClass: "text-blue-700",
    backgroundClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },

  Offered: {
    icon: "🎉",
    label: "Offered",
    textClass: "text-emerald-700",
    backgroundClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },

  Rejected: {
    icon: "❌",
    label: "Rejected",
    textClass: "text-red-700",
    backgroundClass: "bg-red-50",
    borderClass: "border-red-200",
  },
};

/*
|--------------------------------------------------------------------------
| Storage helpers
|--------------------------------------------------------------------------
*/

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
}

function getUserName(user) {
  return (
    user?.fullName ||
    user?.name ||
    user?.user?.fullName ||
    user?.user?.name ||
    "User"
  );
}

/*
|--------------------------------------------------------------------------
| Application helpers
|--------------------------------------------------------------------------
*/

function normalizeStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (
    value === "offered" ||
    value === "offer" ||
    value === "hired"
  ) {
    return "Offered";
  }

  if (
    value === "rejected" ||
    value === "declined"
  ) {
    return "Rejected";
  }

  // Screening, Interview, Submitted, Shortlisted and other active
  // statuses are currently included under Applied.
  return "Applied";
}

function getJobTitle(application) {
  return (
    application?.jobSnapshot?.title ||
    application?.job?.title ||
    application?.title ||
    "Job position"
  );
}

function getApplicationDate(application) {
  return (
    application?.appliedAt ||
    application?.createdAt ||
    application?.applicationDate ||
    null
  );
}

function formatApplicationDate(application) {
  const rawDate = getApplicationDate(application);

  if (!rawDate) {
    return "Date unavailable";
  }

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/*
|--------------------------------------------------------------------------
| Statistic card
|--------------------------------------------------------------------------
*/

function DashboardStatCard({
  icon,
  value,
  title,
  subtitle,
  iconClass,
}) {
  return (
    <div className="flex min-h-[120px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="font-serif text-3xl font-bold leading-none text-slate-950">
          {value}
        </p>

        <h3 className="mt-2 text-sm font-semibold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Overview page
|--------------------------------------------------------------------------
*/

export default function Overview({ setPage }) {
  const [applications, setApplications] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load user and applications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      setUserName(getUserName(storedUser));
    }

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchMyApplications();

        const applicationData = Array.isArray(response)
          ? response
          : Array.isArray(response?.applications)
          ? response.applications
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.applications)
          ? response.data.applications
          : [];

        setApplications(applicationData);
      } catch (apiError) {
        console.error(
          "Failed to fetch applications:",
          apiError
        );

        setApplications([]);

        setError(
          apiError?.response?.data?.message ||
            apiError?.message ||
            "Unable to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Counts
  |--------------------------------------------------------------------------
  */

  const counts = useMemo(() => {
    const result = {
      Applied: 0,
      Offered: 0,
      Rejected: 0,
    };

    applications.forEach((application) => {
      const status = normalizeStatus(application?.status);
      result[status] += 1;
    });

    return result;
  }, [applications]);

  /*
  |--------------------------------------------------------------------------
  | Recent applications
  |--------------------------------------------------------------------------
  */

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((first, second) => {
        const firstDate = new Date(
          getApplicationDate(first) || 0
        ).getTime();

        const secondDate = new Date(
          getApplicationDate(second) || 0
        ).getTime();

        return secondDate - firstDate;
      })
      .slice(0, 5);
  }, [applications]);

  const firstName =
    userName?.trim()?.split(/\s+/)?.[0] || "User";

  return (
    <div className="w-full">
      {/* Welcome banner */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 px-5 py-7 shadow-sm sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-5 -top-12 h-44 w-44 rounded-full border border-white/10" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm text-white/65">
              Good morning 👋
            </p>

            <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Welcome back, {firstName}!
            </h1>

            <p className="mt-2 text-sm text-white/75">
              You have applied for{" "}
              <span className="font-bold text-blue-200">
                {applications.length}
              </span>{" "}
              {applications.length === 1
                ? "job"
                : "jobs"}
              .
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPage?.("applications")}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 sm:w-auto"
          >
            View Applications
          </button>
        </div>
      </section>

      {/* Three statistic cards */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard
          icon="📋"
          value={applications.length}
          title="Total Applied"
          subtitle="All applications"
          iconClass="bg-blue-100"
        />

        <DashboardStatCard
          icon="🎉"
          value={counts.Offered}
          title="Offers"
          subtitle="Offers received"
          iconClass="bg-emerald-100"
        />

        <DashboardStatCard
          icon="❌"
          value={counts.Rejected}
          title="Rejected"
          subtitle="Closed applications"
          iconClass="bg-red-100"
        />
      </section>

      {/* Application pipeline */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-bold text-slate-950">
          Application Pipeline
        </h2>

        <div className="mt-5 grid overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-3">
          {Object.entries(PIPELINE_STATUS).map(
            ([status, meta], index) => (
              <div
                key={status}
                className={[
                  "flex min-h-[150px] flex-col items-center justify-center p-5 text-center",
                  meta.backgroundClass,
                  index !== 2
                    ? "border-b border-slate-200 md:border-b-0 md:border-r"
                    : "",
                ].join(" ")}
              >
                <div className="text-3xl">
                  {meta.icon}
                </div>

                <div
                  className={`mt-3 font-serif text-3xl font-bold ${meta.textClass}`}
                >
                  {counts[status] || 0}
                </div>

                <div
                  className={`mt-1 text-sm font-semibold ${meta.textClass}`}
                >
                  {meta.label}
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Recent applications */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-xl font-bold text-slate-950">
            Recent Applications
          </h2>

          <button
            type="button"
            onClick={() => setPage?.("applications")}
            className="rounded-lg border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />

              Loading your applications...
            </div>
          </div>
        ) : error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : recentApplications.length === 0 ? (
          <div className="mt-5 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
            <span className="text-3xl">📭</span>

            <h3 className="mt-3 text-sm font-semibold text-slate-800">
              No applications found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your submitted job applications will appear
              here.
            </p>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-slate-100">
            {recentApplications.map(
              (application, index) => {
                const normalizedStatus =
                  normalizeStatus(application?.status);

                return (
                  <div
                    key={
                      application?._id ||
                      application?.id ||
                      `${getJobTitle(application)}-${index}`
                    }
                    className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Only name and applied date */}
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-950 sm:text-base">
                        {getJobTitle(application)}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Applied on{" "}
                        {formatApplicationDate(application)}
                      </p>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto">
                      <StatusBadge
                        status={normalizedStatus}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}