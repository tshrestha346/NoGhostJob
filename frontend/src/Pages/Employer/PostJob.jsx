import { useEffect, useMemo, useState } from "react";
import {
  createJob,
  updateJob,
} from "./employerApi";

/*
|--------------------------------------------------------------------------
| Job options
|--------------------------------------------------------------------------
*/

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Product",
  "Operations",
  "Finance",
  "Human Resources",
  "Sales",
  "Customer Support",
  "Other",
];

/*
 * These values must match the enum values
 * defined in your backend Job model.
 */
const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Remote",
  "Hybrid",
  "Internship",
];

const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Junior",
  "Mid Level",
  "Senior",
  "Lead",
  "No Experience Required",
];

const INITIAL_FORM = {
  title: "",
  department: "Engineering",
  type: "Full Time",
  location: "",
  salary: "",
  experienceLevel: "Entry Level",
  description: "",
  requirementsText: "",
  isFeatured: false,
  isActive: true,
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getJobId(job) {
  return job?._id || job?.id || null;
}

function getEditJobForm(job) {
  const requirements = Array.isArray(job?.requirements)
    ? job.requirements.join("\n")
    : typeof job?.requirements === "string"
      ? job.requirements
      : "";

  return {
    title: job?.title || "",
    department:
      job?.department ||
      job?.dept ||
      "Engineering",
    type:
      job?.type ||
      job?.jobType ||
      "Full Time",
    location:
      job?.loc ||
      job?.location ||
      "",
    salary:
      job?.sal ||
      job?.salary ||
      job?.salaryRange ||
      "",
    experienceLevel:
      job?.experienceLevel ||
      job?.experience ||
      "Entry Level",
    description:
      job?.description ||
      job?.desc ||
      "",
    requirementsText: requirements,
    isFeatured: Boolean(
      job?.isFeatured ||
        job?.featured
    ),
    isActive:
      job?.is_active !== false &&
      job?.isActive !== false &&
      job?.status !== "Inactive",
  };
}

function convertRequirementsToArray(value) {
  return value
    .split("\n")
    .map((requirement) => requirement.trim())
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function PostJob({
  editJob,
  setEditJob,
  setPage,
  companyId,
  onSaved,
}) {
  const isEdit = Boolean(editJob);

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load edit information
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isEdit) {
      setForm(getEditJobForm(editJob));
    } else {
      setForm(INITIAL_FORM);
    }

    setFieldErrors({});
    setServerError("");
  }, [editJob, isEdit]);

  /*
  |--------------------------------------------------------------------------
  | Character counters
  |--------------------------------------------------------------------------
  */

  const descriptionLength = useMemo(
    () => form.description.length,
    [form.description]
  );

  /*
  |--------------------------------------------------------------------------
  | Update field
  |--------------------------------------------------------------------------
  */

  const updateField = (field, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((previousErrors) => ({
        ...previousErrors,
        [field]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    const errors = {};

    if (!companyId) {
      errors.companyId =
        "Company information is missing. Please log in again or complete your company profile.";
    }

    if (!form.title.trim()) {
      errors.title = "Job title is required.";
    } else if (form.title.trim().length < 3) {
      errors.title =
        "Job title must contain at least 3 characters.";
    }

    if (!form.department) {
      errors.department =
        "Department is required.";
    }

    if (!form.type) {
      errors.type = "Job type is required.";
    }

    if (!JOB_TYPES.includes(form.type)) {
      errors.type =
        "Please select a valid job type.";
    }

    if (!form.location.trim()) {
      errors.location =
        "Job location is required.";
    } else if (form.location.trim().length < 2) {
      errors.location =
        "Please enter a valid job location.";
    }

    if (!form.salary.trim()) {
      errors.salary =
        "Salary range is required.";
    } else if (form.salary.trim().length < 3) {
      errors.salary =
        "Please enter a valid salary range.";
    }

    if (!form.experienceLevel) {
      errors.experienceLevel =
        "Experience level is required.";
    }

    if (!form.description.trim()) {
      errors.description =
        "Job description is required.";
    } else if (
      form.description.trim().length < 50
    ) {
      errors.description =
        "Job description must contain at least 50 characters.";
    }

    const requirements =
      convertRequirementsToArray(
        form.requirementsText
      );

    if (requirements.length === 0) {
      errors.requirementsText =
        "Add at least one job requirement.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const requirements =
      convertRequirementsToArray(
        form.requirementsText
      );

    /*
     * These property names match the Job schema:
     *
     * title
     * company
     * loc
     * type
     * sal
     * description
     * requirements
     * isFeatured
     * is_active
     */
    const payload = {
      title: form.title.trim(),
      company: companyId,
      companyId,

      loc: form.location.trim(),
      type: form.type,
      sal: form.salary.trim(),

      department: form.department,
      experienceLevel: form.experienceLevel,

      description: form.description.trim(),
      requirements,

      isFeatured: form.isFeatured,
      is_active: form.isActive,
    };

    try {
      setSaving(true);
      setServerError("");

      if (isEdit) {
        const jobId = getJobId(editJob);

        if (!jobId) {
          throw new Error(
            "The selected job does not have a valid ID."
          );
        }

        await updateJob(jobId, payload);
      } else {
        await createJob(payload);
      }

      if (typeof onSaved === "function") {
        await onSaved();
      }

      if (typeof setEditJob === "function") {
        setEditJob(null);
      }

      if (typeof setPage === "function") {
        setPage("jobs");
      }
    } catch (error) {
      console.error(
        "Failed to save job:",
        error
      );

      setServerError(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "The job could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Cancel
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {
    if (typeof setEditJob === "function") {
      setEditJob(null);
    }

    if (typeof setPage === "function") {
      setPage("jobs");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Shared classes
  |--------------------------------------------------------------------------
  */

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const requiredClass =
    "ml-1 text-red-500";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const errorInputClass =
    "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100";

  const helperClass =
    "mt-2 text-xs leading-5 text-slate-500";

  const errorClass =
    "mt-2 text-xs font-medium text-red-600";

  return (
    <main className="min-h-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Page heading */}
        <div className="mb-7 text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            Employer Dashboard
          </span>

          <h1 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
            {isEdit
              ? "Edit Job Position"
              : "Post a New Job"}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            {isEdit
              ? "Update the job information below. Required fields must be completed before saving."
              : "Provide complete and accurate information so candidates can understand the opportunity before applying."}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Fields marked with{" "}
            <span className="font-bold text-red-500">
              *
            </span>{" "}
            are mandatory.
          </p>
        </div>

        {/* Missing company warning */}
        {fieldErrors.companyId && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>

              <div>
                <p className="font-bold">
                  Company information required
                </p>

                <p className="mt-1 font-normal leading-6">
                  {fieldErrors.companyId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API/server error */}
        {serverError && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>

              <div>
                <p className="font-bold">
                  Job could not be saved
                </p>

                <p className="mt-1 leading-6">
                  {serverError}
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          {/* Basic job information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 border-b border-slate-100 pb-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  💼
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Basic Job Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the main information candidates
                    will see in the job listing.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Job title */}
              <div>
                <label
                  htmlFor="job-title"
                  className={labelClass}
                >
                  Job Title
                  <span className={requiredClass}>
                    *
                  </span>
                </label>

                <input
                  id="job-title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="Example: Junior React Developer"
                  className={`${inputClass} ${
                    fieldErrors.title
                      ? errorInputClass
                      : ""
                  }`}
                />

                {fieldErrors.title ? (
                  <p className={errorClass}>
                    {fieldErrors.title}
                  </p>
                ) : (
                  <p className={helperClass}>
                    Use a clear title that accurately
                    describes the position.
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Department */}
                <div>
                  <label
                    htmlFor="job-department"
                    className={labelClass}
                  >
                    Department
                    <span className={requiredClass}>
                      *
                    </span>
                  </label>

                  <select
                    id="job-department"
                    value={form.department}
                    onChange={(event) =>
                      updateField(
                        "department",
                        event.target.value
                      )
                    }
                    className={`${inputClass} ${
                      fieldErrors.department
                        ? errorInputClass
                        : ""
                    }`}
                  >
                    {DEPARTMENTS.map(
                      (department) => (
                        <option
                          key={department}
                          value={department}
                        >
                          {department}
                        </option>
                      )
                    )}
                  </select>

                  {fieldErrors.department && (
                    <p className={errorClass}>
                      {fieldErrors.department}
                    </p>
                  )}
                </div>

                {/* Job type */}
                <div>
                  <label
                    htmlFor="job-type"
                    className={labelClass}
                  >
                    Job Type
                    <span className={requiredClass}>
                      *
                    </span>
                  </label>

                  <select
                    id="job-type"
                    value={form.type}
                    onChange={(event) =>
                      updateField(
                        "type",
                        event.target.value
                      )
                    }
                    className={`${inputClass} ${
                      fieldErrors.type
                        ? errorInputClass
                        : ""
                    }`}
                  >
                    {JOB_TYPES.map((type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ))}
                  </select>

                  {fieldErrors.type && (
                    <p className={errorClass}>
                      {fieldErrors.type}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Location */}
                <div>
                  <label
                    htmlFor="job-location"
                    className={labelClass}
                  >
                    Location
                    <span className={requiredClass}>
                      *
                    </span>
                  </label>

                  <input
                    id="job-location"
                    type="text"
                    value={form.location}
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value
                      )
                    }
                    placeholder="Example: Berlin, Germany"
                    className={`${inputClass} ${
                      fieldErrors.location
                        ? errorInputClass
                        : ""
                    }`}
                  />

                  {fieldErrors.location ? (
                    <p className={errorClass}>
                      {fieldErrors.location}
                    </p>
                  ) : (
                    <p className={helperClass}>
                      For remote roles, enter
                      “Remote” or the eligible region.
                    </p>
                  )}
                </div>

                {/* Salary */}
                <div>
                  <label
                    htmlFor="job-salary"
                    className={labelClass}
                  >
                    Salary Range
                    <span className={requiredClass}>
                      *
                    </span>
                  </label>

                  <input
                    id="job-salary"
                    type="text"
                    value={form.salary}
                    onChange={(event) =>
                      updateField(
                        "salary",
                        event.target.value
                      )
                    }
                    placeholder="Example: €40,000–€50,000 per year"
                    className={`${inputClass} ${
                      fieldErrors.salary
                        ? errorInputClass
                        : ""
                    }`}
                  />

                  {fieldErrors.salary ? (
                    <p className={errorClass}>
                      {fieldErrors.salary}
                    </p>
                  ) : (
                    <p className={helperClass}>
                      Include the currency and whether
                      the amount is hourly, monthly, or
                      yearly.
                    </p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience-level"
                  className={labelClass}
                >
                  Experience Level
                  <span className={requiredClass}>
                    *
                  </span>
                </label>

                <select
                  id="experience-level"
                  value={form.experienceLevel}
                  onChange={(event) =>
                    updateField(
                      "experienceLevel",
                      event.target.value
                    )
                  }
                  className={`${inputClass} ${
                    fieldErrors.experienceLevel
                      ? errorInputClass
                      : ""
                  }`}
                >
                  {EXPERIENCE_LEVELS.map(
                    (level) => (
                      <option
                        key={level}
                        value={level}
                      >
                        {level}
                      </option>
                    )
                  )}
                </select>

                {fieldErrors.experienceLevel && (
                  <p className={errorClass}>
                    {fieldErrors.experienceLevel}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Description and requirements */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 border-b border-slate-100 pb-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  📄
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Description and Requirements
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Explain the role, responsibilities,
                    qualifications, and expectations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="job-description"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Job Description
                    <span className={requiredClass}>
                      *
                    </span>
                  </label>

                  <span
                    className={`text-xs ${
                      descriptionLength < 50
                        ? "text-slate-400"
                        : "text-emerald-600"
                    }`}
                  >
                    {descriptionLength}/50 minimum
                  </span>
                </div>

                <textarea
                  id="job-description"
                  rows={10}
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the position, daily responsibilities, working environment, team, and what the successful candidate will do..."
                  className={`${inputClass} resize-y leading-6 ${
                    fieldErrors.description
                      ? errorInputClass
                      : ""
                  }`}
                />

                {fieldErrors.description ? (
                  <p className={errorClass}>
                    {fieldErrors.description}
                  </p>
                ) : (
                  <p className={helperClass}>
                    Write at least 50 characters and
                    provide enough information for
                    candidates to understand the role.
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label
                  htmlFor="job-requirements"
                  className={labelClass}
                >
                  Job Requirements
                  <span className={requiredClass}>
                    *
                  </span>
                </label>

                <textarea
                  id="job-requirements"
                  rows={7}
                  value={form.requirementsText}
                  onChange={(event) =>
                    updateField(
                      "requirementsText",
                      event.target.value
                    )
                  }
                  placeholder={`Enter one requirement per line:\nExperience with React and JavaScript\nBasic understanding of REST APIs\nGood written and spoken English\nCurrently enrolled as a student`}
                  className={`${inputClass} resize-y leading-6 ${
                    fieldErrors.requirementsText
                      ? errorInputClass
                      : ""
                  }`}
                />

                {fieldErrors.requirementsText ? (
                  <p className={errorClass}>
                    {fieldErrors.requirementsText}
                  </p>
                ) : (
                  <p className={helperClass}>
                    Enter one requirement on each line.
                    The values will be sent to the backend
                    as an array.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Publishing settings */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 border-b border-slate-100 pb-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  ⚙️
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Publishing Settings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control whether the job appears to
                    candidates.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Active */}
              <label className="flex cursor-pointer items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/50">
                <div>
                  <span className="block text-sm font-bold text-slate-900">
                    Publish as active
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Active jobs can be displayed on the
                    public job listing and home page.
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField(
                      "isActive",
                      event.target.checked
                    )
                  }
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {/* Featured */}
              <label className="flex cursor-pointer items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/50">
                <div>
                  <span className="block text-sm font-bold text-slate-900">
                    Mark as featured
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Featured jobs may be prioritised in
                    the Featured Jobs section.
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField(
                      "isFeatured",
                      event.target.checked
                    )
                  }
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving || !companyId
              }
              className="inline-flex min-w-48 items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:from-blue-800 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                  {isEdit
                    ? "Saving changes..."
                    : "Publishing job..."}
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Publish Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}