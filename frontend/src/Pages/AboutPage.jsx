import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| Platform highlights
|--------------------------------------------------------------------------
*/

const platformHighlights = [
  {
    value: "1-Click",
    label: "Job Applications",
    description:
      "Apply to suitable jobs using your saved profile and CV.",
  },
  {
    value: "4",
    label: "Professional CV Templates",
    description:
      "Create and save a CV using different professional designs.",
  },
  {
    value: "2",
    label: "Dedicated Dashboards",
    description:
      "Separate experiences for job seekers and employers.",
  },
  {
    value: "1",
    label: "Connected Platform",
    description:
      "Search, apply, create CVs, and manage applicants in one place.",
  },
];

/*
|--------------------------------------------------------------------------
| Platform values
|--------------------------------------------------------------------------
*/

const values = [
  {
    icon: "✓",
    title: "Real Opportunities",
    description:
      "We aim to help job seekers find clear and relevant opportunities without unnecessary complexity.",
  },
  {
    icon: "🌍",
    title: "International Focus",
    description:
      "The platform is designed with international students and job seekers in Germany in mind.",
  },
  {
    icon: "⚡",
    title: "Simple Applications",
    description:
      "A saved profile and CV make it easier to apply for jobs with fewer repeated steps.",
  },
  {
    icon: "🤝",
    title: "Better Connections",
    description:
      "NoGhostJob connects suitable candidates with employers through one organised platform.",
  },
];

/*
|--------------------------------------------------------------------------
| Platform features
|--------------------------------------------------------------------------
*/

const features = [
  {
    icon: "🔎",
    title: "Search Relevant Jobs",
    description:
      "Search by job title, keyword, location, job type, and experience level.",
  },
  {
    icon: "📄",
    title: "Build a Professional CV",
    description:
      "Create, edit, preview, and save your CV using multiple professional templates.",
  },
  {
    icon: "🚀",
    title: "Apply in One Click",
    description:
      "Submit applications using your stored account information and selected CV.",
  },
  {
    icon: "📊",
    title: "Track Applications",
    description:
      "View submitted applications and follow their latest status from your dashboard.",
  },
  {
    icon: "🏢",
    title: "Employer Job Management",
    description:
      "Employers can create company profiles, post vacancies, and manage active job listings.",
  },
  {
    icon: "👥",
    title: "Applicant Management",
    description:
      "Review applicants, access their submitted information, and update application statuses.",
  },
];

/*
|--------------------------------------------------------------------------
| Member helpers
|--------------------------------------------------------------------------
*/

function getMemberName(member) {
  return (
    member?.full_name ||
    member?.fullName ||
    member?.name ||
    "Team Member"
  );
}

function getMemberDesignation(member) {
  return (
    member?.designation ||
    member?.role ||
    member?.position ||
    "Team Member"
  );
}

function getMemberDescription(member) {
  return (
    member?.description ||
    member?.bio ||
    "Contributing to the development and improvement of the NoGhostJob platform."
  );
}

function getMemberImage(member) {
  return (
    member?.image ||
    member?.photo ||
    member?.avatar ||
    ""
  );
}

function getInitials(member) {
  const name = getMemberName(member);

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/*
|--------------------------------------------------------------------------
| About page
|--------------------------------------------------------------------------
*/

export default function AboutPage() {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] =
    useState(true);
  const [memberError, setMemberError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load team members
  |--------------------------------------------------------------------------
  */

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      setMemberError("");

      const response = await axios.get(
        `${API_BASE}/admin/members`
      );

      const rows = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.members)
          ? response.data.members
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];

      setMembers(rows);
    } catch (error) {
      console.error("Failed to load members:", error);

      setMembers([]);

      setMemberError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load the team members."
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-6 inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            About NoGhostJob
          </span>

          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Making job searching
            <br />

            <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
              simpler and more transparent
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            NoGhostJob is a job platform designed to help
            job seekers—especially international students—
            discover opportunities, build professional CVs,
            submit applications, and track their progress
            from one place.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/jobs";
              }}
              className="w-full rounded-xl bg-white px-7 py-3 text-sm font-semibold text-blue-800 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-blue-50 sm:w-auto"
            >
              Explore Jobs
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/create-cv";
              }}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
            >
              Create Your CV
            </button>
          </div>
        </div>
      </section>

      {/* Platform highlights */}
      <section className="border-b border-blue-100 bg-blue-50 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {platformHighlights.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm"
            >
              <div className="font-serif text-3xl font-bold text-blue-700">
                {item.value}
              </div>

              <h2 className="mt-2 text-sm font-bold text-slate-900">
                {item.label}
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Mission section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:py-20">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Our Mission
          </span>

          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Helping candidates move from searching to
            applying with confidence
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600">
            Job searching can involve repeated forms,
            unclear application processes, disconnected
            tools, and limited visibility after an
            application is submitted.
          </p>

          <p className="mt-4 text-base leading-8 text-slate-600">
            NoGhostJob brings important parts of the
            process together. Job seekers can maintain
            their profile, build a CV, find relevant
            vacancies, submit applications, and review
            their application status through one account.
          </p>

          <p className="mt-4 text-base leading-8 text-slate-600">
            Employers receive tools to publish vacancies,
            manage their company information, review
            applicants, access submitted CV details, and
            update candidates during the recruitment
            process.
          </p>
        </div>

        {/* Values panel */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-800 p-6 shadow-xl shadow-blue-950/10 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            What guides us
          </span>

          <div className="mt-6 divide-y divide-white/10">
            {values.map((value) => (
              <article
                key={value.title}
                className="flex gap-4 py-6 first:pt-0 last:pb-0"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/10 text-lg text-blue-200">
                  {value.icon}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {value.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who the platform supports */}
      <section className="border-y border-slate-200 bg-slate-50 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              One platform, two experiences
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
              Built for job seekers and employers
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Each account type receives a dedicated
              dashboard and features designed around its
              role in the recruitment process.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Job seekers */}
            <article className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-7 shadow-sm sm:p-9">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-50" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  👤
                </div>

                <span className="mt-6 block text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                  For candidates
                </span>

                <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">
                  Job seeker experience
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Candidates can create a complete profile,
                  build a CV, search for relevant roles,
                  apply directly, and view recent
                  applications from their dashboard.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Personal profile management",
                    "Job search and filters",
                    "Professional CV builder",
                    "Multiple CV templates",
                    "One-click applications",
                    "Application status tracking",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        ✓
                      </span>

                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Employers */}
            <article className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm sm:p-9">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-50" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  🏢
                </div>

                <span className="mt-6 block text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                  For companies
                </span>

                <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950">
                  Employer experience
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Employers can maintain company
                  information, publish vacancies, review
                  applications, inspect candidate details,
                  and manage each applicant's status.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Company profile management",
                    "Create and edit job listings",
                    "Manage active vacancies",
                    "Review job applicants",
                    "View submitted CV details",
                    "Update application status",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        ✓
                      </span>

                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Platform features */}
      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Platform Features
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
              Supporting the complete application journey
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              NoGhostJob combines job discovery, CV
              creation, applications, and employer
              management into a connected workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* International student focus */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-blue-950 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              International student focus
            </span>

            <h2 className="mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
              Designed to make opportunities easier to
              discover
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              International students can face additional
              challenges when searching for work, such as
              identifying suitable part-time roles,
              working-student positions, internships, and
              employers open to diverse candidates.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">
              NoGhostJob aims to present job information
              clearly and provide practical tools that
              reduce repeated work throughout the
              application process.
            </p>
          </div>

          <div className="flex items-center justify-center border-t border-white/10 bg-white/5 p-8 lg:border-l lg:border-t-0">
            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              {[
                {
                  icon: "🎓",
                  label: "Students",
                },
                {
                  icon: "🌐",
                  label: "International talent",
                },
                {
                  icon: "💼",
                  label: "Working students",
                },
                {
                  icon: "🚀",
                  label: "Early careers",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center"
                >
                  <div className="text-3xl">
                    {item.icon}
                  </div>

                  <div className="mt-3 text-sm font-semibold text-white">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="border-t border-slate-200 bg-slate-50 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Our Team
            </span>

            <h2 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
              Meet the people behind NoGhostJob
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              The team works across design, development,
              platform management, and user experience to
              build and improve NoGhostJob.
            </p>
          </div>

          {loadingMembers ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

                <p className="mt-4 text-sm font-semibold text-slate-600">
                  Loading team members...
                </p>
              </div>
            </div>
          ) : memberError ? (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="text-3xl">⚠️</div>

              <h3 className="mt-3 font-semibold text-red-800">
                Team members could not be loaded
              </h3>

              <p className="mt-2 text-sm text-red-600">
                {memberError}
              </p>

              <button
                type="button"
                onClick={loadMembers}
                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : members.length === 0 ? (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="text-4xl">👥</div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Team information coming soon
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Team members added through the admin
                dashboard will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((member, index) => {
                const memberImage =
                  getMemberImage(member);

                return (
                  <article
                    key={
                      member?._id ||
                      member?.id ||
                      `${getMemberName(member)}-${index}`
                    }
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-400" />

                    <div className="p-6 text-center">
                      {memberImage ? (
                        <img
                          src={memberImage}
                          alt={getMemberName(member)}
                          className="mx-auto h-20 w-20 rounded-full border-4 border-blue-50 object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event.currentTarget
                                .nextElementSibling;

                            if (fallback) {
                              fallback.style.display =
                                "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className={`mx-auto h-20 w-20 items-center justify-center rounded-full border-4 border-blue-50 bg-blue-100 font-serif text-xl font-bold text-blue-700 ${
                          memberImage
                            ? "hidden"
                            : "flex"
                        }`}
                      >
                        {getInitials(member) || "TM"}
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-slate-950">
                        {getMemberName(member)}
                      </h3>

                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                        {getMemberDesignation(member)}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-slate-500">
                        {getMemberDescription(member)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-blue-100 bg-blue-50 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-950">
              Ready to take the next step?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore current opportunities or create a
              professional CV to begin applying.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/jobs";
              }}
              className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Browse Jobs
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/contact";
              }}
              className="rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}