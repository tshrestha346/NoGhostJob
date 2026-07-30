import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const supportOptions = [
  {
    icon: "👤",
    title: "Job Seeker Support",
    description:
      "Get help with your profile, job search, applications, saved CV, or account.",
  },
  {
    icon: "🏢",
    title: "Employer Support",
    description:
      "Get assistance with company profiles, job listings, applicants, or employer accounts.",
  },
  {
    icon: "📄",
    title: "CV Builder Support",
    description:
      "Report problems with CV templates, saved CV information, previews, or PDF generation.",
  },
  {
    icon: "🛠️",
    title: "Technical Support",
    description:
      "Tell us about login problems, broken pages, incorrect information, or other technical issues.",
  },
];

const subjectOptions = [
  "General question",
  "Job application issue",
  "Job seeker account issue",
  "Employer account issue",
  "Job posting issue",
  "CV Builder issue",
  "CV preview or PDF issue",
  "Login or registration issue",
  "Report a job listing",
  "Technical problem",
  "Feedback or suggestion",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const updateForm = (field, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.subject) {
      return "Please select a subject.";
    }

    if (!form.message.trim()) {
      return "Please enter your message.";
    }

    if (form.message.trim().length < 10) {
      return "Please provide a little more information about your issue.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/auth/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim(),
            subject: form.subject,
            message: form.message.trim(),
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Your message could not be submitted."
        );
      }

      setSubmitted(true);
    } catch (submitError) {
      console.error(
        "Contact form submission failed:",
        submitError
      );

      setError(
        submitError?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setForm(initialForm);
    setSubmitted(false);
    setError("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-5 py-20 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-40 left-10 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            NoGhostJob Support
          </span>

          <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            How can we help you?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Contact the NoGhostJob team for assistance
            with job applications, employer accounts,
            job listings, CV creation, or technical
            problems.
          </p>
        </div>
      </section>

      {/* Support options */}
      <section className="relative z-20 mx-auto -mt-8 max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {supportOptions.map((option) => (
            <article
              key={option.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {option.icon}
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-950">
                {option.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {option.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Main contact area */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.4fr] lg:px-12 lg:py-20">
        {/* Information section */}
        <aside>
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">
            Contact NoGhostJob
          </span>

          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
            Tell us what you need help with
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            NoGhostJob helps job seekers, including
            international students, discover suitable
            opportunities, create professional CVs, and
            submit applications more easily.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Employers can use the platform to create a
            company profile, publish vacancies, review
            applicants, access submitted CV information,
            and manage application statuses.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🌍
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Built for international job seekers
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Ask questions about finding suitable
                  positions, applications, profiles, and
                  platform features.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                🔒
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Do not send sensitive information
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Do not include passwords, payment
                  details, passport numbers, residence
                  permit numbers, or other confidential
                  information.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl">
                📍
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Platform location
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Berlin, Germany
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-slate-950 to-blue-800 p-6 text-white">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-300">
              Helpful information
            </span>

            <h3 className="mt-3 text-lg font-bold">
              Help us understand the problem
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Include the page where the problem happened,
              what you expected to see, and any error
              message displayed on the screen.
            </p>
          </div>
        </aside>

        {/* Contact form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 lg:p-10">
          {submitted ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 text-4xl text-emerald-600">
                ✓
              </div>

              <span className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-emerald-600">
                Message submitted
              </span>

              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
                Thank you, {form.name}
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                Your message has been sent to the
                NoGhostJob team. We will review the
                information you provided and contact you
                through{" "}
                <strong className="text-slate-700">
                  {form.email}
                </strong>
                .
              </p>

              <button
                type="button"
                onClick={handleSendAnother}
                className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-8">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600">
                  Support form
                </span>

                <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950">
                  Send us a message
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Complete the form below and provide as
                  much information as possible about your
                  question or problem.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className={labelClass}
                  >
                    Full name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className={labelClass}
                  >
                    Email address{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(event) =>
                      updateForm(
                        "email",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-company"
                    className={labelClass}
                  >
                    Company or organisation
                  </label>

                  <input
                    id="contact-company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Optional"
                    value={form.company}
                    onChange={(event) =>
                      updateForm(
                        "company",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className={labelClass}
                  >
                    What do you need help with?{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(event) =>
                      updateForm(
                        "subject",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Select a subject
                    </option>

                    {subjectOptions.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-message"
                  className={labelClass}
                >
                  Message{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="contact-message"
                  rows={7}
                  placeholder="Describe your question or problem. Include any error message and explain what happened."
                  value={form.message}
                  onChange={(event) =>
                    updateForm(
                      "message",
                      event.target.value
                    )
                  }
                  className={`${inputClass} resize-y leading-6`}
                />

                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Do not include passwords or sensitive
                    personal information.
                  </span>

                  <span>
                    {form.message.length} characters
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Fields marked with{" "}
                  <span className="text-red-500">*</span>{" "}
                  are required.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-w-44 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    "Submit message →"
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </section>

      {/* Bottom information section */}
      <section className="border-t border-blue-100 bg-blue-50 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Looking for a job?
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Browse available positions and apply using
              your saved NoGhostJob profile and CV.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/jobs";
            }}
            className="rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-100"
          >
            Explore Jobs
          </button>
        </div>
      </section>
    </main>
  );
}