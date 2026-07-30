import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  fetchJobs,
  fetchCompanies,
  fetchCategories,
  fetchTestimonials,
} from "../services/api";

/*
|--------------------------------------------------------------------------
| API response helpers
|--------------------------------------------------------------------------
*/

function extractArray(response, key) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.[key])) {
    return response[key];
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.[key])) {
    return response.data[key];
  }

  return [];
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
      value.label ||
      fallback
    );
  }

  return fallback;
}

/*
|--------------------------------------------------------------------------
| Job helpers
|--------------------------------------------------------------------------
*/

function getJobDisplayData(job) {
  const company = getText(
    job?.company,
    getText(job?.companyName, "Company")
  );

  const location = getText(
    job?.loc ||
      job?.location ||
      job?.city ||
      job?.jobLocation,
    "Location not specified"
  );

  const type = getText(
    job?.type ||
      job?.jobType ||
      job?.employmentType,
    "Full Time"
  );

  const salary = getText(
    job?.sal ||
      job?.salary ||
      job?.salaryRange ||
      job?.compensation,
    "Salary not specified"
  );

  const companyInitials = company
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return {
    id: job?._id || job?.id,

    title: getText(
      job?.title || job?.jobTitle,
      "Untitled position"
    ),

    company,
    location,
    type,
    salary,

    logo:
      job?.logo ||
      job?.company?.logo ||
      companyInitials ||
      "💼",

    colour:
      job?.lc ||
      job?.color ||
      job?.company?.color ||
      "#1565C0",

    description: getText(
      job?.description || job?.summary
    ),

    featured: Boolean(
      job?.isFeatured || job?.featured
    ),

    active:
      job?.is_active !== false &&
      job?.isActive !== false &&
      job?.status !== "inactive" &&
      job?.status !== "closed",
  };
}

/*
|--------------------------------------------------------------------------
| Company helpers
|--------------------------------------------------------------------------
*/

function getCompanyDisplayData(company) {
  const name = getText(
    company?.name ||
      company?.companyName ||
      company?.title,
    "Company"
  );

  const generatedInitials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return {
    id: company?._id || company?.id,
    name,

    initials:
      company?.initials ||
      generatedInitials ||
      "CO",

    logo:
      company?.logo ||
      company?.image ||
      "",

    colour:
      company?.color ||
      company?.colour ||
      "#1565C0",

    rating: Number(company?.rating) || 0,

    openings: Number(
      company?.openings ??
        company?.jobCount ??
        company?.jobsCount ??
        company?.jobs?.length ??
        0
    ),
  };
}

/*
|--------------------------------------------------------------------------
| Category helpers
|--------------------------------------------------------------------------
*/

function getCategoryDisplayData(category) {
  return {
    id: category?._id || category?.id,

    name: getText(
      category?.name ||
        category?.title ||
        category?.category,
      "Category"
    ),

    icon:
      category?.icon ||
      category?.emoji ||
      "💼",

    jobs: Number(
      category?.jobs ??
        category?.jobCount ??
        category?.jobsCount ??
        category?.openings ??
        0
    ),
  };
}

/*
|--------------------------------------------------------------------------
| Testimonial helpers
|--------------------------------------------------------------------------
*/

function getTestimonialDisplayData(testimonial) {
  const name = getText(
    testimonial?.name ||
      testimonial?.fullName ||
      testimonial?.userName,
    "NoGhostJob User"
  );

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return {
    id: testimonial?._id || testimonial?.id,

    name,

    initials:
      testimonial?.initials ||
      initials ||
      "NU",

    rating:
      Number(testimonial?.rating) || 5,

    text: getText(
      testimonial?.text ||
        testimonial?.message ||
        testimonial?.description ||
        testimonial?.testimonial,
      ""
    ),

    role: getText(
      testimonial?.role ||
        testimonial?.designation ||
        testimonial?.position,
      "Job Seeker"
    ),

    colour:
      testimonial?.color ||
      testimonial?.colour ||
      "#1565C0",
  };
}

/*
|--------------------------------------------------------------------------
| Counter
|--------------------------------------------------------------------------
*/

function Counter({ end, suffix = "" }) {
  const [value, setValue] = useState(0);
  const counterRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !started.current
        ) {
          started.current = true;

          if (end <= 0) {
            setValue(0);
            return;
          }

          let currentValue = 0;
          const step = Math.max(end / 45, 1);

          const timer = setInterval(() => {
            currentValue += step;

            if (currentValue >= end) {
              setValue(end);
              clearInterval(timer);
            } else {
              setValue(Math.floor(currentValue));
            }
          }, 18);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [end]);

  return (
    <span ref={counterRef}>
      {value.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Shared components
|--------------------------------------------------------------------------
*/

function Stars({ value }) {
  return (
    <div className="flex justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${
            star <= Math.round(value)
              ? "text-amber-500"
              : "text-slate-200"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="mb-3.5 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.3px] text-blue-700">
      {children}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Static features
|--------------------------------------------------------------------------
*/

const FEATURES = [
  {
    icon: "⚡",
    title: "Simple Application Process",
    desc: "Use your saved profile and CV to submit applications without repeatedly entering the same information.",
  },
  {
    icon: "📄",
    title: "Professional CV Builder",
    desc: "Create and save a professional CV using multiple templates directly on the platform.",
  },
  {
    icon: "📊",
    title: "Application Tracking",
    desc: "Review your submitted applications and follow their current status from your dashboard.",
  },
  {
    icon: "🌍",
    title: "Student-Focused Opportunities",
    desc: "Discover opportunities suitable for students, international talent, graduates, and early-career candidates.",
  },
];

/*
|--------------------------------------------------------------------------
| Hero
|--------------------------------------------------------------------------
*/

function Hero() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(event) {
    event.preventDefault();

    const searchParams = new URLSearchParams();

    const cleanKeyword = keyword.trim();
    const cleanLocation = location.trim();

    if (cleanKeyword) {
      searchParams.set("keyword", cleanKeyword);
    }

    if (cleanLocation) {
      searchParams.set("location", cleanLocation);
    }

    const query = searchParams.toString();

    navigate(
      query ? `/jobs?${query}` : "/jobs"
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
      {[500, 360, 220].map((size, index) => (
        <div
          key={size}
          className="pointer-events-none absolute rounded-full border border-blue-300/10"
          style={{
            width: size,
            height: size,
            top: `${-size / 2 + index * 30}px`,
            right: `${-size / 2 + index * 30}px`,
          }}
        />
      ))}

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-400/10 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.3px] text-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Student-focused job platform
        </span>

        <h1 className="mb-5 font-serif text-4xl font-bold leading-tight tracking-[-1.5px] text-white sm:text-5xl lg:text-6xl">
          Find Your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            Next Opportunity
          </span>{" "}
          Today
        </h1>

        <p className="mb-10 text-base leading-8 text-white/65 sm:text-lg">
          Discover suitable jobs, build a professional CV,
          apply more easily, and track your applications
          through one connected platform.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mb-8 grid max-w-3xl gap-2 rounded-2xl border border-[#DDEAFC] bg-white p-3 shadow-[0_20px_60px_rgba(7,25,46,0.25)] md:grid-cols-[1fr_1fr_auto] md:gap-0"
        >
          <div className="relative md:border-r md:border-[#DDEAFC]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              🔍
            </span>

            <input
              type="text"
              value={keyword}
              onChange={(event) =>
                setKeyword(event.target.value)
              }
              placeholder="Job title, company, or skill..."
              className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#07192E] outline-none"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              📍
            </span>

            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="City or remote..."
              className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#07192E] outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-7 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(21,101,192,0.35)] transition hover:opacity-90"
          >
            Find Job Positions
          </button>
        </form>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Real statistics
|--------------------------------------------------------------------------
*/

function StatsStrip({
  jobs,
  companies,
  categories,
  testimonials,
}) {
  const activeJobs = jobs.filter((job) => {
    const data = getJobDisplayData(job);
    return data.active;
  }).length;

  const featuredJobs = jobs.filter(
    (job) =>
      job?.isFeatured === true ||
      job?.featured === true
  ).length;

  const realStats = [
    {
      value: activeJobs,
      label: "Active Jobs",
      icon: "💼",
    },
    {
      value: companies.length,
      label: "Registered Companies",
      icon: "🏢",
    },
    {
      value: categories.length,
      label: "Job Categories",
      icon: "📂",
    },
    {
      value:
        testimonials.length > 0
          ? testimonials.length
          : featuredJobs,
      label:
        testimonials.length > 0
          ? "Success Stories"
          : "Featured Jobs",
      icon:
        testimonials.length > 0 ? "⭐" : "📈",
    },
  ];

  return (
    <section className="border-y border-blue-200 bg-blue-50 px-5 py-9 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4">
        {realStats.map((stat, index) => (
          <div
            key={stat.label}
            className={`text-center ${
              index < realStats.length - 1
                ? "lg:border-r lg:border-blue-200"
                : ""
            }`}
          >
            <div className="mb-1 text-3xl">
              {stat.icon}
            </div>

            <div className="font-serif text-3xl font-extrabold leading-none text-blue-700">
              <Counter end={stat.value} />
            </div>

            <div className="mt-1.5 text-sm text-slate-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Job card
|--------------------------------------------------------------------------
*/

function JobCard({ job }) {
  const data = getJobDisplayData(job);

  const typeClass = {
    "Full Time":
      "border-blue-200 bg-blue-50 text-blue-700",

    "Full-Time":
      "border-blue-200 bg-blue-50 text-blue-700",

    Remote:
      "border-green-200 bg-green-100 text-green-700",

    Hybrid:
      "border-amber-200 bg-amber-100 text-amber-700",

    "Part Time":
      "border-purple-200 bg-purple-50 text-purple-700",

    "Part-Time":
      "border-purple-200 bg-purple-50 text-purple-700",

    Internship:
      "border-pink-200 bg-pink-50 text-pink-700",
  };

  const logoIsImage =
    typeof data.logo === "string" &&
    (data.logo.startsWith("http://") ||
      data.logo.startsWith("https://") ||
      data.logo.startsWith("data:image"));

  return (
    <article className="group flex h-full flex-col gap-3 rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white p-5 shadow-[0_2px_10px_rgba(10,30,60,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_12px_40px_rgba(21,101,192,0.13)]">
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border text-sm font-extrabold"
          style={{
            backgroundColor: `${data.colour}18`,
            borderColor: `${data.colour}30`,
            color: data.colour,
          }}
        >
          {logoIsImage ? (
            <img
              src={data.logo}
              alt={`${data.company} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            data.logo
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-serif text-base font-bold text-[#07192E]">
              {data.title}
            </h3>

            {data.featured && (
              <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                Featured
              </span>
            )}
          </div>

          <p className="mt-1 truncate text-xs text-slate-500">
            🏢 {data.company} · 📍 {data.location}
          </p>
        </div>
      </div>

      {data.description && (
        <p className="line-clamp-2 text-xs leading-5 text-slate-600">
          {data.description}
        </p>
      )}

      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
        <span className="truncate text-sm font-bold text-blue-700">
          {data.salary}
        </span>

        <span className="flex-1" />

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
            typeClass[data.type] ||
            "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {data.type}
        </span>
      </div>

      {data.id ? (
        <Link
          to={`/jobs/${data.id}`}
          className="w-full rounded-lg bg-gradient-to-br from-blue-700 to-blue-400 py-2.5 text-center text-sm font-bold text-white opacity-90 transition-opacity group-hover:opacity-100"
        >
          View Job →
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-lg bg-slate-300 py-2.5 text-sm font-bold text-white"
        >
          Job unavailable
        </button>
      )}
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Featured jobs
|--------------------------------------------------------------------------
*/

function FeaturedJobs({ jobs }) {
  const activeJobs = jobs.filter((job) => {
    const data = getJobDisplayData(job);
    return data.active;
  });

  const featuredJobs = activeJobs.filter(
    (job) =>
      job?.isFeatured === true ||
      job?.featured === true
  );

  const jobsToShow = (
    featuredJobs.length > 0
      ? featuredJobs
      : activeJobs
  )
    .slice()
    .sort((first, second) => {
      const firstDate = new Date(
        first?.createdAt ||
          first?.postedAt ||
          first?.updatedAt ||
          0
      ).getTime();

      const secondDate = new Date(
        second?.createdAt ||
          second?.postedAt ||
          second?.updatedAt ||
          0
      ).getTime();

      return secondDate - firstDate;
    })
    .slice(0, 6);

  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Featured Roles</SectionLabel>

          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Featured Jobs
          </h2>

          <p className="text-slate-500">
            Discover recently added opportunities from
            companies hiring through NoGhostJob.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobsToShow.length > 0 ? (
            jobsToShow.map((job, index) => (
              <JobCard
                key={
                  job?._id ||
                  job?.id ||
                  `job-${index}`
                }
                job={job}
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="text-4xl">💼</div>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                No jobs are available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                New opportunities will appear here after
                employers publish them.
              </p>
            </div>
          )}
        </div>

        {activeJobs.length > jobsToShow.length && (
          <div className="mt-10 text-center">
            <Link
              to="/jobs"
              className="inline-flex rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
            >
              View All Job Positions →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Top companies
|--------------------------------------------------------------------------
*/

function TopCompanies({
  companies,
  jobs,
}) {
  const companiesToShow = companies
    .map((company) => {
      const companyData =
        getCompanyDisplayData(company);

      const realOpeningCount = jobs.filter((job) => {
        const jobCompanyId =
          job?.company?._id ||
          job?.company?.id ||
          job?.companyId;

        const jobCompanyName = getText(
          job?.company ||
            job?.companyName
        );

        const companyId = companyData.id;

        const sameCompanyId =
          companyId &&
          jobCompanyId &&
          String(companyId) ===
            String(jobCompanyId);

        const sameCompanyName =
          jobCompanyName &&
          companyData.name &&
          jobCompanyName
            .trim()
            .toLowerCase() ===
            companyData.name
              .trim()
              .toLowerCase();

        const active =
          getJobDisplayData(job).active;

        return (
          active &&
          (sameCompanyId || sameCompanyName)
        );
      }).length;

      return {
        ...companyData,
        openings:
          realOpeningCount ||
          companyData.openings,
      };
    })
    .sort(
      (first, second) =>
        second.openings - first.openings
    )
    .slice(0, 6);

  return (
    <section className="border-t border-[#DDEAFC] bg-[#F7FAFF] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Hiring Now</SectionLabel>

          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Top Companies
          </h2>

          <p className="text-slate-500">
            Explore companies currently available on
            NoGhostJob.
          </p>
        </div>

        {companiesToShow.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {companiesToShow.map(
              (company, index) => {
                const logoIsImage =
                  typeof company.logo ===
                    "string" &&
                  (company.logo.startsWith(
                    "http://"
                  ) ||
                    company.logo.startsWith(
                      "https://"
                    ) ||
                    company.logo.startsWith(
                      "data:image"
                    ));

                return (
                  <Link
                    key={
                      company.id ||
                      `${company.name}-${index}`
                    }
                    to={
                      company.id
                        ? `/companies/${company.id}`
                        : "/companies"
                    }
                    className="rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white px-3 py-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_8px_28px_rgba(21,101,192,0.12)]"
                  >
                    <div
                      className="mx-auto mb-3 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl border text-base font-extrabold"
                      style={{
                        backgroundColor: `${company.colour}18`,
                        borderColor: `${company.colour}30`,
                        color: company.colour,
                      }}
                    >
                      {logoIsImage ? (
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        company.initials
                      )}
                    </div>

                    <div className="mb-1 truncate text-sm font-bold text-[#07192E]">
                      {company.name}
                    </div>

                    {company.rating > 0 ? (
                      <Stars
                        value={company.rating}
                      />
                    ) : (
                      <div className="h-5 text-xs text-slate-400">
                        No rating
                      </div>
                    )}

                    <div className="mt-1 text-[11px] text-slate-500">
                      {company.openings}{" "}
                      {company.openings === 1
                        ? "opening"
                        : "openings"}
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="text-4xl">🏢</div>

            <h3 className="mt-3 text-lg font-bold text-slate-900">
              No companies found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Registered companies will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

function Categories({ categories }) {
  const categoriesToShow = categories
    .map(getCategoryDisplayData)
    .slice(0, 6);

  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Explore Fields</SectionLabel>

          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Browse by Category
          </h2>

          <p className="text-slate-500">
            Find opportunities in your preferred field.
          </p>
        </div>

        {categoriesToShow.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoriesToShow.map(
              (category, index) => (
                <Link
                  key={
                    category.id ||
                    `${category.name}-${index}`
                  }
                  to={`/jobs?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group flex items-center gap-4 rounded-2xl border-[1.5px] border-[#DDEAFC] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-[0_8px_28px_rgba(21,101,192,0.12)]"
                >
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-2xl">
                    {category.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1 truncate text-base font-bold text-[#07192E]">
                      {category.name}
                    </div>

                    <div className="text-sm text-slate-500">
                      {category.jobs.toLocaleString(
                        "en-GB"
                      )}{" "}
                      open{" "}
                      {category.jobs === 1
                        ? "position"
                        : "positions"}
                    </div>
                  </div>

                  <span className="ml-auto text-xl font-bold text-blue-700 opacity-30 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </Link>
              )
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <div className="text-4xl">📂</div>

            <h3 className="mt-3 text-lg font-bold text-slate-900">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Job categories will appear here once they
              have been added.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Why choose NoGhostJob
|--------------------------------------------------------------------------
*/

function WhyUs() {
  return (
    <section className="border-t border-[#DDEAFC] bg-[#F7FAFF] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionLabel>Our Edge</SectionLabel>

          <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
            Why Choose NoGhostJob
          </h2>

          <p className="text-slate-500">
            Practical tools for a simpler job application
            experience.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-[#DDEAFC] bg-white px-5 py-7 text-center shadow-[0_2px_10px_rgba(10,30,60,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-2xl">
                {feature.icon}
              </div>

              <h3 className="mb-2 text-base font-bold text-[#07192E]">
                {feature.title}
              </h3>

              <p className="m-0 text-sm leading-6 text-slate-500">
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Testimonials
|--------------------------------------------------------------------------
*/

function Testimonials({ testimonials }) {
  const formattedTestimonials =
    testimonials
      .map(getTestimonialDisplayData)
      .filter(
        (testimonial) =>
          testimonial.text.trim().length > 0
      );

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (
      active >= formattedTestimonials.length &&
      formattedTestimonials.length > 0
    ) {
      setActive(0);
    }
  }, [active, formattedTestimonials.length]);

  if (formattedTestimonials.length === 0) {
    return null;
  }

  const testimonial =
    formattedTestimonials[active];

  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>Success Stories</SectionLabel>

        <h2 className="mb-2.5 font-serif text-3xl font-bold tracking-tight text-[#07192E] sm:text-4xl">
          What Our Users Say
        </h2>

        <p className="mb-10 text-slate-500">
          Experiences shared by NoGhostJob users.
        </p>

        <div className="rounded-3xl border border-[#DDEAFC] bg-white px-6 py-10 shadow-[0_8px_40px_rgba(21,101,192,0.08)] sm:px-9">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-extrabold"
            style={{
              backgroundColor: `${testimonial.colour}18`,
              borderColor: `${testimonial.colour}40`,
              color: testimonial.colour,
            }}
          >
            {testimonial.initials}
          </div>

          <Stars value={testimonial.rating} />

          <p className="my-5 font-serif text-base italic leading-8 text-[#3D4A63] sm:text-lg">
            “{testimonial.text}”
          </p>

          <div className="text-base font-bold text-[#07192E]">
            {testimonial.name}
          </div>

          <div className="mt-1 text-sm text-slate-500">
            {testimonial.role}
          </div>

          {formattedTestimonials.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() =>
                  setActive(
                    (active -
                      1 +
                      formattedTestimonials.length) %
                      formattedTestimonials.length
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DDEAFC] text-slate-500 transition hover:border-blue-300 hover:text-blue-700"
              >
                ‹
              </button>

              {formattedTestimonials.map(
                (item, index) => (
                  <button
                    type="button"
                    aria-label={`Show testimonial ${
                      index + 1
                    }`}
                    key={
                      item.id ||
                      `${item.name}-${index}`
                    }
                    onClick={() =>
                      setActive(index)
                    }
                    className={`h-2 rounded-full transition-all ${
                      index === active
                        ? "w-5 bg-blue-700"
                        : "w-2 bg-[#DDEAFC]"
                    }`}
                  />
                )
              )}

              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() =>
                  setActive(
                    (active + 1) %
                      formattedTestimonials.length
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DDEAFC] text-slate-500 transition hover:border-blue-300 hover:text-blue-700"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Loading state
|--------------------------------------------------------------------------
*/

function HomeLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

        <p className="mt-4 text-sm font-semibold text-slate-600">
          Loading NoGhostJob...
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Error state
|--------------------------------------------------------------------------
*/

function HomeError({ message, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <div className="text-4xl">⚠️</div>

        <h1 className="mt-4 font-serif text-2xl font-bold text-slate-950">
          Home page data could not be loaded
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Home page
|--------------------------------------------------------------------------
*/

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHomeData() {
    try {
      setLoading(true);
      setError("");

      /*
       * Promise.allSettled allows the page to show available
       * sections even when one endpoint fails.
       */
      const results = await Promise.allSettled([
        fetchJobs(),
        fetchCompanies(),
        fetchCategories(),
        fetchTestimonials(),
      ]);

      const [
        jobsResult,
        companiesResult,
        categoriesResult,
        testimonialsResult,
      ] = results;

      const jobsData =
        jobsResult.status === "fulfilled"
          ? extractArray(
              jobsResult.value,
              "jobs"
            )
          : [];

      const companiesData =
        companiesResult.status === "fulfilled"
          ? extractArray(
              companiesResult.value,
              "companies"
            )
          : [];

      const categoriesData =
        categoriesResult.status === "fulfilled"
          ? extractArray(
              categoriesResult.value,
              "categories"
            )
          : [];

      const testimonialsData =
        testimonialsResult.status === "fulfilled"
          ? extractArray(
              testimonialsResult.value,
              "testimonials"
            )
          : [];

      setJobs(jobsData);
      setCompanies(companiesData);
      setCategories(categoriesData);
      setTestimonials(testimonialsData);

      const allRequestsFailed = results.every(
        (result) =>
          result.status === "rejected"
      );

      if (allRequestsFailed) {
        const firstRejected = results.find(
          (result) =>
            result.status === "rejected"
        );

        throw (
          firstRejected?.reason ||
          new Error(
            "Unable to connect to the API."
          )
        );
      }

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const endpointNames = [
            "jobs",
            "companies",
            "categories",
            "testimonials",
          ];

          console.error(
            `Failed to load ${endpointNames[index]}:`,
            result.reason
          );
        }
      });
    } catch (loadError) {
      console.error(
        "Failed to load home data:",
        loadError
      );

      setError(
        loadError?.response?.data?.message ||
          loadError?.message ||
          "Unable to load the home page."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHomeData();
  }, []);

  if (loading) {
    return <HomeLoading />;
  }

  if (
    error &&
    jobs.length === 0 &&
    companies.length === 0 &&
    categories.length === 0 &&
    testimonials.length === 0
  ) {
    return (
      <HomeError
        message={error}
        onRetry={loadHomeData}
      />
    );
  }

  return (
    <main className="overflow-x-hidden font-['Segoe_UI',system-ui,sans-serif]">
      <Hero />

      <StatsStrip
        jobs={jobs}
        companies={companies}
        categories={categories}
        testimonials={testimonials}
      />

      <FeaturedJobs jobs={jobs} />

      <TopCompanies
        companies={companies}
        jobs={jobs}
      />

      <Categories categories={categories} />

      <WhyUs />

      <Testimonials
        testimonials={testimonials}
      />
    </main>
  );
}