import { useMemo, useState } from "react";

import {
  updateApplicationStatus,
  frontendStatusToBackend,
} from "./employerApi";


const STATUS_META = {
  Applied: {
    icon: "📩",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700",
    button:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  },

  Shortlisted: {
    icon: "⭐",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700",
    button:
      "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  },

  Interview: {
    icon: "🎙️",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700",
    button:
      "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
  },

  Offered: {
    icon: "🎉",
    badge:
      "border-green-200 bg-green-50 text-green-700",
    button:
      "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
  },

  Rejected: {
    icon: "✕",
    badge:
      "border-red-200 bg-red-50 text-red-700",
    button:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  },
};


function backendStatusToFrontend(status) {
  const statusMap = {
    Submitted: "Applied",
    Applied: "Applied",
    "Under Review": "Applied",
    Shortlisted: "Shortlisted",
    Interview: "Interview",
    Hired: "Offered",
    Offered: "Offered",
    Rejected: "Rejected",
  };

  return statusMap[status] || "Applied";
}

function formatApplicationDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createInitials(name) {
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    return "U";
  }

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeText(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}

function hasObjectContent(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  );
}


function hasCvContent(cv) {
  if (!cv || typeof cv !== "object") {
    return false;
  }

  const data =
    cv?.data &&
    typeof cv.data === "object"
      ? cv.data
      : cv;

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    return false;
  }

  const personal =
    data.personal &&
    typeof data.personal === "object"
      ? data.personal
      : {};

  const hasPersonalInformation =
    Object.values(personal).some(
      (value) =>
        typeof value === "string" &&
        value.trim()
    );

  const hasSummary =
    typeof data.summary === "string" &&
    data.summary.trim();

  const hasExperience =
    Array.isArray(data.experience) &&
    data.experience.some(
      (item) =>
        item?.role ||
        item?.position ||
        item?.company ||
        item?.description
    );

  const hasEducation =
    Array.isArray(data.education) &&
    data.education.some(
      (item) =>
        item?.degree ||
        item?.school ||
        item?.institution
    );

  const hasSkills =
    Array.isArray(data.skills) &&
    data.skills.length > 0;

  const hasProjects =
    Array.isArray(data.projects) &&
    data.projects.length > 0;

  return Boolean(
    hasPersonalInformation ||
      hasSummary ||
      hasExperience ||
      hasEducation ||
      hasSkills ||
      hasProjects
  );
}


function getSelectedCv(application) {
  const snapshotCv =
    application?.applicantSnapshot?.cv;

  const populatedApplicantCv =
    application?.applicant?.cv;

  const applicationCv =
    application?.cv;

  if (hasCvContent(snapshotCv)) {
    return snapshotCv;
  }

  if (hasCvContent(populatedApplicantCv)) {
    return populatedApplicantCv;
  }

  if (hasCvContent(applicationCv)) {
    return applicationCv;
  }

  return (
    populatedApplicantCv ||
    snapshotCv ||
    applicationCv ||
    null
  );
}

function getCvData(application) {
  const cv = getSelectedCv(application);

  if (!cv) {
    return {
      cv: null,
      template: "",
      skills: [],
      experience: "",
    };
  }

  const actualData =
    cv?.data &&
    typeof cv.data === "object"
      ? cv.data
      : cv;

  const experienceItems =
    safeArray(actualData?.experience);

  const experienceText =
    experienceItems
      .filter(
        (item) =>
          item?.role ||
          item?.position ||
          item?.company
      )
      .map((item) => {
        const role =
          item?.role ||
          item?.position ||
          item?.jobTitle ||
          "";

        const company =
          item?.company ||
          item?.organisation ||
          item?.organization ||
          "";

        return [role, company]
          .filter(Boolean)
          .join(" at ");
      })
      .filter(Boolean)
      .join(", ");

  return {
    cv,

    template:
      cv?.template ||
      cv?.templateName ||
      "modern",

    skills:
      safeArray(actualData?.skills),

    experience:
      experienceText ||
      actualData?.experienceSummary ||
      "",
  };
}

function normalizeApplicant(application) {
  const applicant =
    application?.applicant || {};

  const snapshot =
    application?.applicantSnapshot || {};

  const job =
    application?.job || {};

  const jobSnapshot =
    application?.jobSnapshot || {};

  const cvData =
    getCvData(application);

  const fullName =
    applicant?.fullName ||
    applicant?.name ||
    snapshot?.fullName ||
    application?.name ||
    "Unknown Applicant";

  const email =
    applicant?.email ||
    snapshot?.email ||
    application?.email ||
    "";

  const phone =
    applicant?.phoneNo ||
    applicant?.phone ||
    snapshot?.phoneNo ||
    snapshot?.phone ||
    application?.phone ||
    "";

  const jobTitle =
    job?.title ||
    jobSnapshot?.title ||
    application?.role ||
    "Position not specified";

  const location =
    applicant?.location ||
    applicant?.address ||
    job?.loc ||
    job?.location ||
    jobSnapshot?.location ||
    application?.loc ||
    "Not specified";

  const salary =
    job?.sal ||
    job?.salary ||
    jobSnapshot?.salary ||
    application?.salary ||
    "Not specified";

  const skills =
    Array.isArray(application?.skills)
      ? application.skills
      : cvData.skills;

  const experience =
    application?.exp ||
    applicant?.experience ||
    cvData.experience ||
    "Not specified";

  const rawStatus =
    application?.backendStatus ||
    application?.status ||
    "Submitted";

  const frontendStatus =
    STATUS_META[rawStatus]
      ? rawStatus
      : backendStatusToFrontend(
          rawStatus
        );

  const scoreValue =
    Number(
      application?.score ??
        applicant?.matchScore ??
        0
    ) || 0;

  return {
    id:
      application?._id ||
      application?.id,

    rawApplication:
      application,

    name:
      fullName,

    initials:
      application?.initials ||
      createInitials(fullName),

    email,
    phone,

    role:
      jobTitle,

    status:
      frontendStatus,

    backendStatus:
      rawStatus,

    rejectionReason:
      application?.rejectionReason ||
      "",

    applied:
      application?.applied ||
      formatApplicationDate(
        application?.appliedAt ||
          application?.createdAt
      ),

    appliedAt:
      application?.appliedAt ||
      application?.createdAt ||
      null,

    loc:
      location,

    exp:
      experience,

    salary,

    skills,

    score:
      scoreValue,

    coverLetter:
      application?.coverLetter ||
      "",

    cv:
      cvData.cv,

    hasCv:
      hasCvContent(cvData.cv),

    cvTemplate:
      cvData.template,

    accountType:
      applicant?.accountType ||
      application?.accountType ||
      "",

    applicantId:
      applicant?._id ||
      application?.applicantId ||
      "",

    jobId:
      job?._id ||
      application?.jobId ||
      "",

    jobType:
      job?.type ||
      jobSnapshot?.type ||
      "",

    company:
      typeof job?.company === "object"
        ? job.company?.name
        : jobSnapshot?.companyName ||
          jobSnapshot?.company ||
          job?.company ||
          "",
  };
}


function StatusBadge({ status }) {
  const meta =
    STATUS_META[status];

  if (!meta) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${meta.badge}`}
    >
      <span>{meta.icon}</span>
      {status}
    </span>
  );
}


function SectionHeader({
  title,
  sub,
  action,
  onAction,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="font-serif text-xl font-bold text-slate-900">
          {title}
        </h2>

        {sub && (
          <p className="mt-1 text-sm text-slate-500">
            {sub}
          </p>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:from-blue-800 hover:to-blue-600"
        >
          {action}
        </button>
      )}
    </div>
  );
}


function RejectModal({
  applicantName,
  onConfirm,
  onCancel,
}) {
  const [reason, setReason] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const trimmedReason =
    reason.trim();

  const handleConfirm =
    async () => {
      if (!trimmedReason) {
        return;
      }

      setSubmitting(true);

      try {
        await onConfirm(
          trimmedReason
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
        <h3 className="font-serif text-lg font-bold text-slate-900">
          Reject {applicantName}
          &apos;s application
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          This reason will be
          visible to the
          applicant. Please be
          clear and respectful.
        </p>

        <textarea
          value={reason}
          onChange={(event) =>
            setReason(
              event.target.value
            )
          }
          placeholder="Explain why the application is being rejected."
          rows={5}
          className="mt-4 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {!trimmedReason && (
          <p className="mt-2 text-xs font-medium text-red-600">
            A rejection reason is
            required.
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleConfirm
            }
            disabled={
              !trimmedReason ||
              submitting
            }
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Rejecting..."
              : "Reject Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  msg,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  danger = false,
}) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="text-4xl">
          {danger ? "⚠️" : "❓"}
        </div>

        <h3 className="mt-4 font-serif text-lg font-bold text-slate-900">
          {msg}
        </h3>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white transition ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


function normalizeSkill(skill) {
  if (
    typeof skill === "string"
  ) {
    return skill;
  }

  return (
    skill?.name ||
    skill?.skill ||
    skill?.title ||
    ""
  );
}

function CvSection({
  title,
  children,
}) {
  return (
    <section className="mt-8 break-inside-avoid">
      <h2 className="border-b border-slate-300 pb-2 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-800">
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function CvEntry({
  title,
  subtitle,
  date,
  description,
  link,
}) {
  return (
    <article className="mb-6 break-inside-avoid last:mb-0">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
        <div>
          {title && (
            <h3 className="font-bold text-slate-900">
              {title}
            </h3>
          )}

          {subtitle && (
            <p className="mt-1 text-sm font-medium text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        {date && (
          <span className="shrink-0 text-xs font-semibold text-slate-500">
            {date}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
          {description}
        </p>
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block break-all text-sm font-semibold text-blue-700 hover:underline"
        >
          {link}
        </a>
      )}
    </article>
  );
}


function ApplicantCvModal({
  app,
  onClose,
}) {
  if (!app) {
    return null;
  }

  const cv =
    app.cv || {};

  const cvData =
    cv?.data &&
    typeof cv.data === "object"
      ? cv.data
      : cv;

  const personal =
    cvData?.personal &&
    typeof cvData.personal ===
      "object"
      ? cvData.personal
      : {};

  const fullName =
    personal.fullName ||
    personal.name ||
    app.name ||
    "Applicant";

  const jobTitle =
    personal.jobTitle ||
    personal.title ||
    personal.role ||
    app.role ||
    "";

  const email =
    personal.email ||
    app.email ||
    "";

  const phone =
    personal.phone ||
    personal.phoneNo ||
    app.phone ||
    "";

  const location =
    personal.location ||
    personal.address ||
    app.loc ||
    "";

  const website =
    personal.website ||
    personal.portfolio ||
    personal.linkedin ||
    "";

  const summary =
    safeText(
      cvData?.summary ||
        cvData?.profile ||
        cvData?.about
    );

  const skills =
    safeArray(cvData?.skills)
      .map(normalizeSkill)
      .filter(Boolean);

  const experience =
    safeArray(
      cvData?.experience
    );

  const education =
    safeArray(
      cvData?.education
    );

  const projects =
    safeArray(
      cvData?.projects
    );

  const languages =
    safeArray(
      cvData?.languages
    );

  const certifications =
    safeArray(
      cvData?.certifications
    );

  const achievements =
    safeArray(
      cvData?.achievements
    );

  const references =
    safeArray(
      cvData?.references
    );

  const handlePrint = () => {
    window.print();
  };

  const cvHasContent =
    hasCvContent(cv);

  return (
    <div
      className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }

            #applicant-cv-print,
            #applicant-cv-print * {
              visibility: visible !important;
            }

            #applicant-cv-print {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 32px !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }

            .cv-no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div
        className="mx-auto w-full max-w-5xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="cv-no-print mb-4 flex flex-wrap justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/30 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-lg transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        {!cvHasContent ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-2xl">
            <div className="text-5xl">
              📄
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              CV data is not
              available
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              The application was
              loaded successfully,
              but no saved CV data
              was found in either
              the applicant snapshot
              or the current user
              profile.
            </p>

            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-800">
              The backend response
              must include{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5">
                applicant.cv
              </code>{" "}
              or{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5">
                applicantSnapshot.cv
              </code>
              .
            </div>
          </div>
        ) : (
          <article
            id="applicant-cv-print"
            className="rounded-2xl bg-white p-7 text-slate-800 shadow-2xl sm:p-10 lg:p-14"
          >
            <header className="flex flex-col justify-between gap-6 border-b-4 border-blue-700 pb-7 sm:flex-row sm:items-start">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  {fullName}
                </h1>

                {jobTitle && (
                  <p className="mt-2 text-lg font-semibold text-blue-700">
                    {jobTitle}
                  </p>
                )}

                {app.cvTemplate && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Template:{" "}
                    {app.cvTemplate}
                  </p>
                )}
              </div>

              <div className="space-y-1 text-sm leading-6 text-slate-600 sm:text-right">
                {email && (
                  <p>{email}</p>
                )}

                {phone && (
                  <p>{phone}</p>
                )}

                {location && (
                  <p>{location}</p>
                )}

                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all font-semibold text-blue-700 hover:underline"
                  >
                    {website}
                  </a>
                )}
              </div>
            </header>

            {summary && (
              <CvSection title="Professional Profile">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                  {summary}
                </p>
              </CvSection>
            )}

            {skills.length > 0 && (
              <CvSection title="Skills">
                <div className="flex flex-wrap gap-2">
                  {skills.map(
                    (
                      skill,
                      index
                    ) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </CvSection>
            )}

            {experience.length >
              0 && (
              <CvSection title="Professional Experience">
                {experience.map(
                  (
                    item,
                    index
                  ) => {
                    const role =
                      item?.role ||
                      item?.position ||
                      item?.jobTitle ||
                      item?.title ||
                      "";

                    const company =
                      item?.company ||
                      item?.organisation ||
                      item?.organization ||
                      "";

                    const itemLocation =
                      item?.location ||
                      "";

                    const start =
                      item?.startDate ||
                      item?.start ||
                      item?.from ||
                      "";

                    const end =
                      item?.endDate ||
                      item?.end ||
                      item?.to ||
                      "";

                    return (
                      <CvEntry
                        key={
                          item?._id ||
                          item?.id ||
                          index
                        }
                        title={role}
                        subtitle={[
                          company,
                          itemLocation,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(" · ")}
                        date={[
                          start,
                          end,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(" – ")}
                        description={
                          item?.description ||
                          item?.details ||
                          ""
                        }
                      />
                    );
                  }
                )}
              </CvSection>
            )}

            {education.length >
              0 && (
              <CvSection title="Education">
                {education.map(
                  (
                    item,
                    index
                  ) => {
                    const degree =
                      item?.degree ||
                      item?.qualification ||
                      item?.course ||
                      item?.title ||
                      "";

                    const school =
                      item?.school ||
                      item?.institution ||
                      item?.university ||
                      "";

                    const start =
                      item?.startDate ||
                      item?.start ||
                      item?.from ||
                      "";

                    const end =
                      item?.endDate ||
                      item?.end ||
                      item?.to ||
                      "";

                    return (
                      <CvEntry
                        key={
                          item?._id ||
                          item?.id ||
                          index
                        }
                        title={degree}
                        subtitle={school}
                        date={[
                          start,
                          end,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(" – ")}
                        description={
                          item?.description ||
                          item?.details ||
                          ""
                        }
                      />
                    );
                  }
                )}
              </CvSection>
            )}

            {projects.length > 0 && (
              <CvSection title="Projects">
                {projects.map(
                  (
                    item,
                    index
                  ) => (
                    <CvEntry
                      key={
                        item?._id ||
                        item?.id ||
                        index
                      }
                      title={
                        item?.name ||
                        item?.title ||
                        "Project"
                      }
                      subtitle={
                        item?.technologies ||
                        item?.technology ||
                        ""
                      }
                      description={
                        item?.description ||
                        item?.details ||
                        ""
                      }
                      link={
                        item?.link ||
                        item?.url ||
                        ""
                      }
                    />
                  )
                )}
              </CvSection>
            )}

            {certifications.length >
              0 && (
              <CvSection title="Certifications">
                <div className="space-y-3">
                  {certifications.map(
                    (
                      item,
                      index
                    ) => {
                      const title =
                        typeof item ===
                        "string"
                          ? item
                          : item?.name ||
                            item?.title ||
                            item?.certificate ||
                            "";

                      const issuer =
                        typeof item ===
                        "object"
                          ? item?.issuer ||
                            item?.organization ||
                            ""
                          : "";

                      const date =
                        typeof item ===
                        "object"
                          ? item?.date ||
                            item?.year ||
                            ""
                          : "";

                      return (
                        <div
                          key={
                            item?._id ||
                            item?.id ||
                            index
                          }
                          className="flex flex-col justify-between gap-1 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row"
                        >
                          <div>
                            <p className="font-bold text-slate-900">
                              {title}
                            </p>

                            {issuer && (
                              <p className="mt-1 text-sm text-slate-600">
                                {
                                  issuer
                                }
                              </p>
                            )}
                          </div>

                          {date && (
                            <span className="text-xs font-semibold text-slate-500">
                              {date}
                            </span>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </CvSection>
            )}

            {languages.length >
              0 && (
              <CvSection title="Languages">
                <div className="flex flex-wrap gap-2">
                  {languages.map(
                    (
                      item,
                      index
                    ) => {
                      const language =
                        typeof item ===
                        "string"
                          ? item
                          : item?.name ||
                            item?.language ||
                            "";

                      const level =
                        typeof item ===
                        "object"
                          ? item?.level ||
                            item?.proficiency ||
                            ""
                          : "";

                      return (
                        <span
                          key={
                            item?._id ||
                            item?.id ||
                            index
                          }
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
                        >
                          {language}
                          {level
                            ? ` — ${level}`
                            : ""}
                        </span>
                      );
                    }
                  )}
                </div>
              </CvSection>
            )}

            {achievements.length >
              0 && (
              <CvSection title="Achievements">
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                  {achievements.map(
                    (
                      item,
                      index
                    ) => (
                      <li
                        key={
                          item?._id ||
                          item?.id ||
                          index
                        }
                      >
                        {typeof item ===
                        "string"
                          ? item
                          : item?.title ||
                            item?.description ||
                            ""}
                      </li>
                    )
                  )}
                </ul>
              </CvSection>
            )}

            {references.length >
              0 && (
              <CvSection title="References">
                <div className="grid gap-4 sm:grid-cols-2">
                  {references.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          item?._id ||
                          item?.id ||
                          index
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="font-bold text-slate-900">
                          {item?.name ||
                            "Reference"}
                        </p>

                        {item?.position && (
                          <p className="mt-1 text-sm text-slate-600">
                            {
                              item.position
                            }
                          </p>
                        )}

                        {item?.company && (
                          <p className="text-sm text-slate-600">
                            {
                              item.company
                            }
                          </p>
                        )}

                        {item?.email && (
                          <p className="mt-2 break-all text-sm text-blue-700">
                            {item.email}
                          </p>
                        )}

                        {item?.phone && (
                          <p className="text-sm text-slate-600">
                            {item.phone}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </CvSection>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Applicant details modal
|--------------------------------------------------------------------------
*/

function ApplicantModal({
  app,
  onClose,
  onStatus,
  onReject,
  onViewCv,
}) {
  if (!app) {
    return null;
  }

  const nextStatuses =
    Object.keys(
      STATUS_META
    ).filter(
      (status) =>
        status !== app.status
    );

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-400 text-lg font-extrabold text-white shadow-md">
              {app.initials}
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">
                {app.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Applied for:{" "}
                {app.role}
              </p>

              <div className="mt-2">
                <StatusBadge
                  status={
                    app.status
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {app.status ===
          "Rejected" &&
          app.rejectionReason && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-red-700">
                Rejection reason
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {
                  app.rejectionReason
                }
              </p>
            </div>
          )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            [
              "🗓 Applied",
              app.applied,
            ],
            [
              "📍 Job location",
              app.loc,
            ],
            [
              "💼 Experience",
              app.exp,
            ],
            [
              "💰 Salary",
              app.salary,
            ],
          ].map(
            ([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-blue-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {label}
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                  {value ||
                    "Not specified"}
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-5 space-y-3">
          <InfoRow
            label="Email"
            value={
              app.email ||
              "Not provided"
            }
          />

          <InfoRow
            label="Phone"
            value={
              app.phone ||
              "Not provided"
            }
          />

          {app.jobType && (
            <InfoRow
              label="Job type"
              value={
                app.jobType
              }
            />
          )}

          {app.coverLetter && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <p className="font-bold text-slate-900">
                Cover letter
              </p>

              <p className="mt-2 whitespace-pre-wrap">
                {
                  app.coverLetter
                }
              </p>
            </div>
          )}

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">
                  Applicant CV
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {app.hasCv
                    ? "CV data is available and can be displayed directly."
                    : "No saved CV data was found."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onViewCv(app)
                }
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                {app.hasCv
                  ? "View CV"
                  : "Check CV"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">
              Profile Match Score
            </span>

            <span
              className={`text-sm font-extrabold ${
                app.score >= 85
                  ? "text-green-700"
                  : app.score >= 70
                    ? "text-amber-700"
                    : "text-red-700"
              }`}
            >
              {app.score}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-400 transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    app.score
                  )
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-900">
            Skills
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {app.skills.length >
            0 ? (
              app.skills.map(
                (
                  skill,
                  index
                ) => {
                  const label =
                    normalizeSkill(
                      skill
                    );

                  if (!label) {
                    return null;
                  }

                  return (
                    <span
                      key={`${label}-${index}`}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                    >
                      {label}
                    </span>
                  );
                }
              )
            ) : (
              <span className="text-sm text-slate-500">
                No skills
                provided.
              </span>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {nextStatuses
            .filter(
              (status) =>
                status !==
                "Applied"
            )
            .map((status) => {
              const meta =
                STATUS_META[
                  status
                ];

              const isRejected =
                status ===
                "Rejected";

              return (
                <button
                  key={status}
                  type="button"
                  onClick={async () => {
                    if (
                      isRejected
                    ) {
                      onClose();
                      onReject(
                        app.id
                      );
                      return;
                    }

                    await onStatus(
                      app.id,
                      status
                    );

                    onClose();
                  }}
                  className={`min-w-[120px] flex-1 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${meta.button}`}
                >
                  {meta.icon}{" "}
                  {status}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
      <span className="font-bold text-slate-900">
        {label}:
      </span>{" "}
      <span className="break-words">
        {value}
      </span>
    </div>
  );
}


export default function ApplicantsView({
  applicants = [],
  setApplicants,
  selectedJob,
  onShowAll,
}) {
  const [filter, setFilter] =
    useState("All");

  const [selectedId, setSelectedId] =
    useState(null);

  const [confirmId, setConfirmId] =
    useState(null);

  const [rejectId, setRejectId] =
    useState(null);

  const [
    cvApplicant,
    setCvApplicant,
  ] = useState(null);

  const [
    statusUpdatingId,
    setStatusUpdatingId,
  ] = useState(null);

  const normalizedApplicants =
    useMemo(() => {
      if (
        !Array.isArray(
          applicants
        )
      ) {
        return [];
      }

      return applicants
        .map(
          normalizeApplicant
        )
        .filter(
          (application) =>
            application.id
        );
    }, [applicants]);

  const selected =
    normalizedApplicants.find(
      (application) =>
        application.id ===
        selectedId
    ) || null;

  const confirm =
    normalizedApplicants.find(
      (application) =>
        application.id ===
        confirmId
    ) || null;

  const rejectTarget =
    normalizedApplicants.find(
      (application) =>
        application.id ===
        rejectId
    ) || null;

  const statuses = [
    "All",
    ...Object.keys(
      STATUS_META
    ),
  ];

  const filtered =
    filter === "All"
      ? normalizedApplicants
      : normalizedApplicants.filter(
          (application) =>
            application.status ===
            filter
        );

  /*
  |--------------------------------------------------------------------------
  | Update application status
  |--------------------------------------------------------------------------
  */

  const updateStatus = async (
    applicationId,
    frontendStatus,
    rejectionReason = ""
  ) => {
    try {
      setStatusUpdatingId(
        applicationId
      );

      const backendStatus =
        frontendStatusToBackend(
          frontendStatus
        );

      const response =
        await updateApplicationStatus(
          applicationId,
          backendStatus,
          rejectionReason
        );

      if (
        typeof setApplicants ===
        "function"
      ) {
        setApplicants(
          (
            currentApplicants
          ) => {
            if (
              !Array.isArray(
                currentApplicants
              )
            ) {
              return [];
            }

            return currentApplicants.map(
              (application) => {
                const currentId =
                  application?._id ||
                  application?.id;

                if (
                  currentId !==
                  applicationId
                ) {
                  return application;
                }

                return {
                  ...application,

                  status:
                    response
                      ?.application
                      ?.status ||
                    backendStatus,

                  backendStatus:
                    response
                      ?.application
                      ?.status ||
                    backendStatus,

                  rejectionReason:
                    response
                      ?.application
                      ?.rejectionReason ??
                    "",
                };
              }
            );
          }
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      window.alert(
        error.message ||
          "Failed to update application status."
      );

      throw error;
    } finally {
      setStatusUpdatingId(
        null
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove applicant from frontend state
  |--------------------------------------------------------------------------
  */

  const removeApplicant = (
    applicationId
  ) => {
    if (
      typeof setApplicants ===
      "function"
    ) {
      setApplicants(
        (
          currentApplicants
        ) => {
          if (
            !Array.isArray(
              currentApplicants
            )
          ) {
            return [];
          }

          return currentApplicants.filter(
            (application) =>
              (application?._id ||
                application?.id) !==
              applicationId
          );
        }
      );
    }

    setConfirmId(null);

    if (
      selectedId ===
      applicationId
    ) {
      setSelectedId(null);
    }
  };

  return (
    <div className="w-full">
      {selected && (
        <ApplicantModal
          app={selected}
          onClose={() =>
            setSelectedId(
              null
            )
          }
          onStatus={
            updateStatus
          }
          onReject={(id) =>
            setRejectId(id)
          }
          onViewCv={(app) => {
            setCvApplicant(app);
          }}
        />
      )}

      {cvApplicant && (
        <ApplicantCvModal
          app={cvApplicant}
          onClose={() =>
            setCvApplicant(
              null
            )
          }
        />
      )}

      {confirm && (
        <ConfirmModal
          msg={`Remove ${confirm.name}'s application from this list?`}
          onConfirm={() =>
            removeApplicant(
              confirm.id
            )
          }
          onCancel={() =>
            setConfirmId(
              null
            )
          }
          confirmLabel="Remove"
          danger
        />
      )}

      {rejectTarget && (
        <RejectModal
          applicantName={
            rejectTarget.name
          }
          onCancel={() =>
            setRejectId(null)
          }
          onConfirm={async (
            reason
          ) => {
            await updateStatus(
              rejectTarget.id,
              "Rejected",
              reason
            );

            setRejectId(null);
          }}
        />
      )}

      <SectionHeader
        title={
          selectedJob
            ? `Applicants for ${selectedJob.title}`
            : "Applicants"
        }
        sub={`${
          normalizedApplicants.length
        } candidate${
          normalizedApplicants.length ===
          1
            ? ""
            : "s"
        }`}
        action={
          selectedJob
            ? "Show All Applicants"
            : undefined
        }
        onAction={onShowAll}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {statuses.map(
          (status) => {
            const meta =
              STATUS_META[
                status
              ];

            const active =
              filter === status;

            const count =
              status === "All"
                ? normalizedApplicants.length
                : normalizedApplicants.filter(
                    (
                      application
                    ) =>
                      application.status ===
                      status
                  ).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setFilter(status)
                }
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? meta?.badge ||
                      "border-blue-200 bg-blue-50 font-bold text-blue-700"
                    : "border-slate-200 bg-white font-medium text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {status !==
                  "All" &&
                  `${
                    meta?.icon ||
                    ""
                  } `}

                {status} ({count})
              </button>
            );
          }
        )}
      </div>

      {filtered.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-5 py-16 text-center">
          <div className="text-4xl">
            👤
          </div>

          <h3 className="mt-4 font-serif text-lg font-bold text-slate-900">
            No applicants found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            No applications
            match the selected
            status.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(
            (app) => {
              const isUpdating =
                statusUpdatingId ===
                app.id;

              return (
                <article
                  key={app.id}
                  className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-400 text-sm font-extrabold text-white shadow">
                        {
                          app.initials
                        }
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-slate-900">
                            {app.name}
                          </h3>

                          <StatusBadge
                            status={
                              app.status
                            }
                          />

                          {app.hasCv && (
                            <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                              CV available
                            </span>
                          )}

                          <span
                            className={`ml-auto text-sm font-extrabold ${
                              app.score >=
                              85
                                ? "text-green-700"
                                : app.score >=
                                    70
                                  ? "text-amber-700"
                                  : "text-red-700"
                            }`}
                          >
                            ⭐{" "}
                            {app.score}
                            %
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                          <Metadata
                            icon="📋"
                            value={
                              app.role
                            }
                          />

                          <Metadata
                            icon="📅"
                            value={`Applied ${app.applied}`}
                          />

                          <Metadata
                            icon="📧"
                            value={
                              app.email ||
                              "No email"
                            }
                          />

                          <Metadata
                            icon="📞"
                            value={
                              app.phone ||
                              "No phone"
                            }
                          />

                          <Metadata
                            icon="📍"
                            value={
                              app.loc
                            }
                          />

                          <Metadata
                            icon="💰"
                            value={
                              app.salary
                            }
                          />
                        </div>

                        {app.status ===
                          "Rejected" &&
                          app.rejectionReason && (
                            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                              <strong>
                                Rejection
                                reason:
                              </strong>{" "}
                              {
                                app.rejectionReason
                              }
                            </div>
                          )}

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {app.skills
                            .length >
                          0 ? (
                            app.skills.map(
                              (
                                skill,
                                index
                              ) => {
                                const label =
                                  normalizeSkill(
                                    skill
                                  );

                                if (
                                  !label
                                ) {
                                  return null;
                                }

                                return (
                                  <span
                                    key={`${label}-${index}`}
                                    className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"
                                  >
                                    {
                                      label
                                    }
                                  </span>
                                );
                              }
                            )
                          ) : (
                            <span className="text-xs text-slate-400">
                              No
                              skills
                              provided
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid shrink-0 grid-cols-2 gap-2 lg:w-36 lg:grid-cols-1">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedId(
                            app.id
                          )
                        }
                        className="rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 px-3 py-2.5 text-xs font-bold text-white transition hover:from-blue-800 hover:to-blue-600"
                      >
                        View Profile
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCvApplicant(
                            app
                          )
                        }
                        className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition ${
                          app.hasCv
                            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        View CV
                      </button>

                      {app.status !==
                        "Offered" &&
                        app.status !==
                          "Rejected" && (
                          <button
                            type="button"
                            disabled={
                              isUpdating
                            }
                            onClick={() => {
                              const nextStatus =
                                app.status ===
                                "Applied"
                                  ? "Shortlisted"
                                  : app.status ===
                                      "Shortlisted"
                                    ? "Interview"
                                    : "Offered";

                              updateStatus(
                                app.id,
                                nextStatus
                              );
                            }}
                            className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-100 disabled:cursor-wait disabled:opacity-50"
                          >
                            {isUpdating
                              ? "Updating..."
                              : "▲ Advance"}
                          </button>
                        )}

                      {app.status !==
                        "Rejected" && (
                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            setRejectId(
                              app.id
                            )
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-wait disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Updating..."
                            : "✕ Reject"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setConfirmId(
                            app.id
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

function Metadata({
  icon,
  value,
}) {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <span>{icon}</span>

      <span className="break-words">
        {value}
      </span>
    </span>
  );
}