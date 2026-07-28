import { useMemo, useState } from "react";

import {
  updateApplicationStatus,
  frontendStatusToBackend,
} from "./employerApi";

/*
|--------------------------------------------------------------------------
| Design tokens
|--------------------------------------------------------------------------
*/

const C = {
  navy: "#07192E",
  navyMid: "#0D2B4A",
  blue: "#1565C0",
  blueMid: "#1976D2",
  blueAcc: "#2196F3",
  bluePale: "#E3F2FD",
  blueSoft: "#BBDEFB",
  white: "#FFFFFF",
  offWhite: "#F7FAFF",
  border: "#DDEAFC",
  gray: "#6B7A99",
  grayLight: "#EEF2F7",
  grayDark: "#3D4A63",
  green: "#15803D",
  greenPale: "#DCFCE7",
  greenBd: "#BBF7D0",
  amber: "#B45309",
  amberPale: "#FEF3C7",
  amberBd: "#FDE68A",
  red: "#DC2626",
  redPale: "#FEF2F2",
  redBd: "#FECACA",
  purple: "#7C3AED",
  purplePale: "#EDE9FE",
};

/*
|--------------------------------------------------------------------------
| Status configuration
|--------------------------------------------------------------------------
*/

const STATUS_META = {
  Applied: {
    color: C.blue,
    bg: C.bluePale,
    border: C.blueSoft,
    icon: "📩",
  },

  Shortlisted: {
    color: C.amber,
    bg: C.amberPale,
    border: C.amberBd,
    icon: "⭐",
  },

  Interview: {
    color: C.purple,
    bg: C.purplePale,
    border: "#C4B5FD",
    icon: "🎙️",
  },

  Offered: {
    color: C.green,
    bg: C.greenPale,
    border: C.greenBd,
    icon: "🎉",
  },

  Rejected: {
    color: C.red,
    bg: C.redPale,
    border: C.redBd,
    icon: "✕",
  },
};

/*
|--------------------------------------------------------------------------
| Backend to frontend status mapping
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Date formatting
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Name initials
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Get nested CV information
|--------------------------------------------------------------------------
*/

function getCvData(application) {
  const populatedApplicantCv =
    application?.applicant?.cv;

  const snapshotCv =
    application?.applicantSnapshot?.cv;

  const cv =
    snapshotCv ||
    populatedApplicantCv ||
    {};

  if (typeof cv === "string") {
    return {
      url: cv,
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
    Array.isArray(actualData?.experience)
      ? actualData.experience
      : [];

  const experienceText =
    experienceItems
      .filter(
        (item) =>
          item?.role ||
          item?.company
      )
      .map((item) =>
        [
          item.role,
          item.company,
        ]
          .filter(Boolean)
          .join(" at ")
      )
      .join(", ");

  return {
    url:
      cv?.url ||
      cv?.fileUrl ||
      cv?.downloadUrl ||
      cv?.path ||
      "",

    template:
      cv?.template ||
      cv?.templateName ||
      "",

    skills:
      Array.isArray(actualData?.skills)
        ? actualData.skills
        : [],

    experience:
      experienceText ||
      actualData?.experienceSummary ||
      "",
  };
}
/*
|--------------------------------------------------------------------------
| Normalize one application
|--------------------------------------------------------------------------
| Supports both:
| 1. Raw API objects
| 2. Already-mapped frontend objects
|--------------------------------------------------------------------------
*/

function normalizeApplicant(application) {
  const applicant =
    application?.applicant || {};

  const snapshot =
    application?.applicantSnapshot || {};

  
  const job =
    application?.job || {};

  const jobSnapshot =
    application?.jobSnapshot || {};

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

  const cvData =
    getCvData(application);

  /*
  |--------------------------------------------------------------------------
  | Read generated PDF URL
  |--------------------------------------------------------------------------
  */

  const cvPdfUrl =
    snapshot?.cvPdfUrl ||
    applicant?.cvPdfUrl ||
    application?.cvPdfUrl ||
    "";

  const cvPdfFilename =
    snapshot?.cvPdfFilename ||
    applicant?.cvPdfFilename ||
    application?.cvPdfFilename ||
    "Applicant-CV.pdf";

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
      : backendStatusToFrontend(rawStatus);

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

    /*
    |--------------------------------------------------------------------------
    | Rejection reason (only meaningful when status is "Rejected")
    |--------------------------------------------------------------------------
    */

    rejectionReason:
      application?.rejectionReason || "",

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

    /*
    |--------------------------------------------------------------------------
    | CV fields
    |--------------------------------------------------------------------------
    */

    cvUrl:
      cvData.url,

    cvPdfUrl,

    cvPdfFilename,

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
      application?.job ||
      application?.jobId ||
      "",

    jobType:
      job?.type ||
      jobSnapshot?.type ||
      "",

    company:
      typeof job?.company ===
      "object"
        ? job.company?.name
        : jobSnapshot?.companyName ||
          jobSnapshot?.company ||
          job?.company ||
          "",
  };
}

/*
|--------------------------------------------------------------------------
| Status badge
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {
  const meta =
    STATUS_META[status];

  if (!meta) {
    return null;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 10px",
        borderRadius: "20px",
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        color: meta.color,
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {meta.icon} {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Section header
|--------------------------------------------------------------------------
*/

function SectionHeader({
  title,
  sub,
  action,
  onAction,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginBottom: "18px",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "19px",
            fontWeight: 700,
            color: C.navy,
            fontFamily:
              "'Georgia', serif",
          }}
        >
          {title}
        </div>

        {sub && (
          <div
            style={{
              fontSize: "13px",
              color: C.gray,
              marginTop: "2px",
            }}
          >
            {sub}
          </div>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: `linear-gradient(135deg, ${C.blue}, ${C.blueAcc})`,
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Reject modal (collects a required rejection reason)
|--------------------------------------------------------------------------
*/

function RejectModal({ applicantName, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmedReason = reason.trim();

  const handleConfirm = async () => {
    if (!trimmedReason) {
      return;
    }

    setSubmitting(true);

    try {
      await onConfirm(trimmedReason);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,25,46,0.5)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: C.white,
          borderRadius: "16px",
          padding: "28px 32px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(7,25,46,0.2)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: C.navy,
            marginBottom: "6px",
            fontFamily: "'Georgia', serif",
          }}
        >
          Reject {applicantName}'s application
        </div>

        <div
          style={{
            fontSize: "12.5px",
            color: C.gray,
            marginBottom: "14px",
          }}
        >
          This reason will be visible to the applicant. Please be clear and
          respectful.
        </div>

        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="e.g. We're moving forward with candidates whose experience more closely matches the role's requirements."
          rows={5}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "9px",
            border: `1.5px solid ${C.border}`,
            fontSize: "13px",
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {!trimmedReason && (
          <div
            style={{
              fontSize: "11px",
              color: C.red,
              marginTop: "6px",
            }}
          >
            A reason is required before rejecting.
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "9px",
              border: `1.5px solid ${C.border}`,
              background: "transparent",
              color: C.grayDark,
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!trimmedReason || submitting}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "9px",
              border: "none",
              background: C.red,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor:
                !trimmedReason || submitting ? "not-allowed" : "pointer",
              opacity: !trimmedReason || submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Rejecting..." : "Reject Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Confirmation modal
|--------------------------------------------------------------------------
*/

function ConfirmModal({
  msg,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  danger = false,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(7,25,46,0.5)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: C.white,
          borderRadius: "16px",
          padding: "32px 36px",
          maxWidth: "380px",
          width: "100%",
          boxShadow:
            "0 20px 60px rgba(7,25,46,0.2)",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          {danger ? "⚠️" : "❓"}
        </div>

        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: C.navy,
            textAlign: "center",
            marginBottom: "8px",
            fontFamily:
              "'Georgia', serif",
          }}
        >
          {msg}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "9px",
              border: `1.5px solid ${C.border}`,
              background:
                "transparent",
              color: C.grayDark,
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "9px",
              border: "none",
              background: danger
                ? C.red
                : C.blue,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
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
}) {
  if (!app) {
    return null;
  }

  const nextStatuses =
    Object.keys(STATUS_META).filter(
      (status) =>
        status !== app.status
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(7,25,46,0.5)",
        zIndex: 998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white,
          borderRadius: "18px",
          padding: "32px 36px",
          maxWidth: "620px",
          width: "100%",
          boxShadow:
            "0 24px 80px rgba(7,25,46,0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.blue}, ${C.blueAcc})`,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                fontSize: "18px",
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {app.initials}
            </div>

            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: C.navy,
                  fontFamily:
                    "'Georgia', serif",
                }}
              >
                {app.name}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: C.gray,
                }}
              >
                Applied for: {app.role}
              </div>

              <div
                style={{
                  marginTop: "6px",
                }}
              >
                <StatusBadge
                  status={app.status}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: C.gray,
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {app.status === "Rejected" &&
          app.rejectionReason && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "9px",
                background: C.redPale,
                border: `1px solid ${C.redBd}`,
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.red,
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Rejection reason
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: C.grayDark,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {app.rejectionReason}
              </div>
            </div>
          )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
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
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "11px 14px",
                borderRadius: "9px",
                background: C.offWhite,
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: C.gray,
                  letterSpacing:
                    "0.4px",
                  textTransform:
                    "uppercase",
                  marginBottom: "3px",
                }}
              >
                {label}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: C.navy,
                  overflowWrap:
                    "anywhere",
                }}
              >
                {value ||
                  "Not specified"}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: C.grayDark,
              padding: "10px 12px",
              borderRadius: "8px",
              background: C.offWhite,
            }}
          >
            <strong>Email:</strong>{" "}
            {app.email ||
              "Not provided"}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: C.grayDark,
              padding: "10px 12px",
              borderRadius: "8px",
              background: C.offWhite,
            }}
          >
            <strong>Phone:</strong>{" "}
            {app.phone ||
              "Not provided"}
          </div>

          {app.jobType && (
            <div
              style={{
                fontSize: "13px",
                color: C.grayDark,
                padding: "10px 12px",
                borderRadius: "8px",
                background: C.offWhite,
              }}
            >
              <strong>
                Job type:
              </strong>{" "}
              {app.jobType}
            </div>
          )}

          {app.coverLetter && (
            <div
              style={{
                padding: "12px",
                borderRadius: "9px",
                background: C.offWhite,
                border: `1px solid ${C.border}`,
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              <strong>
                Cover letter:
              </strong>

              <br />

              {app.coverLetter}
            </div>
          )}

          {app.cvTemplate && (
            <div
              style={{
                fontSize: "13px",
                color: C.grayDark,
              }}
            >
              <strong>
                CV template:
              </strong>{" "}
              {app.cvTemplate}
            </div>
          )}

        
          {app.cvPdfUrl ? (
  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "12px",
    }}
  >
    <a
      href={app.cvPdfUrl}
      target="_blank"
      rel="noreferrer"
      style={{
        flex: 1,
        minWidth: "140px",
        padding: "10px 14px",
        borderRadius: "8px",
        background: C.blue,
        color: "#fff",
        fontSize: "13px",
        fontWeight: 700,
        textAlign: "center",
        textDecoration: "none",
      }}
    >
      👁 View CV
    </a>

    <a
      href={app.cvPdfUrl}
      download={
        app.cvPdfFilename ||
        "Applicant-CV.pdf"
      }
      style={{
        flex: 1,
        minWidth: "140px",
        padding: "10px 14px",
        borderRadius: "8px",
        border: `1px solid ${C.blueSoft}`,
        background: C.bluePale,
        color: C.blue,
        fontSize: "13px",
        fontWeight: 700,
        textAlign: "center",
        textDecoration: "none",
      }}
    >
      ⬇ Download CV
    </a>
  </div>
) : (
  <div
    style={{
      padding: "10px",
      borderRadius: "8px",
      background: C.grayLight,
      color: C.gray,
      fontSize: "13px",
    }}
  >
    No CV PDF was included in this
    application.
  </div>
)}
        </div>

        <div
          style={{
            background: C.offWhite,
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: C.navy,
              }}
            >
              Profile Match Score
            </span>

            <span
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color:
                  app.score >= 85
                    ? C.green
                    : app.score >= 70
                      ? C.amber
                      : C.red,
              }}
            >
              {app.score}%
            </span>
          </div>

          <div
            style={{
              height: "6px",
              borderRadius: "6px",
              background: C.grayLight,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    app.score
                  )
                )}%`,
                height: "100%",
                borderRadius: "6px",
                background: `linear-gradient(90deg, ${C.blue}, ${C.blueAcc})`,
                transition:
                  "width 0.5s",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: C.navy,
              marginBottom: "8px",
            }}
          >
            Skills
          </div>

          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {app.skills.length > 0 ? (
              app.skills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    style={{
                      padding:
                        "4px 12px",
                      borderRadius:
                        "6px",
                      background:
                        C.bluePale,
                      border: `1px solid ${C.blueSoft}`,
                      color: C.blue,
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {skill}
                  </span>
                )
              )
            ) : (
              <span
                style={{
                  color: C.gray,
                  fontSize: "13px",
                }}
              >
                No skills provided.
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {nextStatuses
            .filter(
              (status) =>
                status !== "Applied"
            )
            .map((status) => {
              const meta =
                STATUS_META[status];

              const isRejected =
                status === "Rejected";

              return (
                <button
                  key={status}
                  type="button"
                  onClick={async () => {
                    if (isRejected) {
                      onClose();
                      onReject(app.id);
                      return;
                    }

                    await onStatus(
                      app.id,
                      status
                    );

                    onClose();
                  }}
                  style={{
                    flex: 1,
                    minWidth: "110px",
                    padding: "10px",
                    borderRadius: "9px",
                    border: `1.5px solid ${
                      isRejected
                        ? C.redBd
                        : meta.border
                    }`,
                    background:
                      isRejected
                        ? C.redPale
                        : meta.bg,
                    color: isRejected
                      ? C.red
                      : meta.color,
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {meta.icon} {status}
                </button>
              );
            })}
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

  const [statusUpdatingId, setStatusUpdatingId] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Convert raw backend application records into UI records
  |--------------------------------------------------------------------------
  */

  const normalizedApplicants =
    useMemo(() => {
      if (!Array.isArray(applicants)) {
        return [];
      }

      return applicants
        .map(normalizeApplicant)
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
    ...Object.keys(STATUS_META),
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
      setStatusUpdatingId(applicationId);

      const backendStatus =
        frontendStatusToBackend(frontendStatus);

      const response = await updateApplicationStatus(
        applicationId,
        backendStatus,
        rejectionReason
      );

      if (typeof setApplicants === "function") {
        setApplicants((currentApplicants) => {
          if (!Array.isArray(currentApplicants)) {
            return [];
          }

          return currentApplicants.map((application) => {
            const currentId =
              application?._id || application?.id;

            if (currentId !== applicationId) {
              return application;
            }

            return {
              ...application,
              status: response?.application?.status || backendStatus,
              backendStatus: response?.application?.status || backendStatus,
              rejectionReason:
                response?.application?.rejectionReason ?? "",
            };
          });
        });
      }

      return response;
    } catch (error) {
      console.error("Status update failed:", error);
      window.alert(error.message || "Failed to update application status.");
      throw error;
    } finally {
      setStatusUpdatingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove from current frontend list
  |--------------------------------------------------------------------------
  | This only removes the applicant from the displayed state.
  | It does not delete the MongoDB application unless a delete API is added.
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
        (currentApplicants) => {
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
      selectedId === applicationId
    ) {
      setSelectedId(null);
    }
  };

  return (
    <div>
      {selected && (
        <ApplicantModal
          app={selected}
          onClose={() =>
            setSelectedId(null)
          }
          onStatus={updateStatus}
          onReject={(id) =>
            setRejectId(id)
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
            setConfirmId(null)
          }
          confirmLabel="Remove"
          danger
        />
      )}

      {rejectTarget && (
        <RejectModal
          applicantName={rejectTarget.name}
          onCancel={() =>
            setRejectId(null)
          }
          onConfirm={async (reason) => {
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

      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {statuses.map((status) => {
          const meta =
            STATUS_META[status];

          const active =
            filter === status;

          const count =
            status === "All"
              ? normalizedApplicants.length
              : normalizedApplicants.filter(
                  (application) =>
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
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: `1.5px solid ${
                  active
                    ? meta?.border ||
                      C.border
                    : C.border
                }`,
                background: active
                  ? meta?.bg ||
                    C.bluePale
                  : "transparent",
                color: active
                  ? meta?.color ||
                    C.blue
                  : C.gray,
                fontSize: "13px",
                fontWeight: active
                  ? 700
                  : 500,
                cursor: "pointer",
                transition:
                  "all 0.15s",
              }}
            >
              {status !== "All" &&
                `${meta?.icon || ""} `}

              {status} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            background: C.white,
            border: `1px dashed ${C.border}`,
            borderRadius: "14px",
          }}
        >
          <div
            style={{
              fontSize: "34px",
              marginBottom: "10px",
            }}
          >
            👤
          </div>

          <div
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: C.navy,
              fontFamily:
                "'Georgia', serif",
            }}
          >
            No applicants found
          </div>

          <div
            style={{
              marginTop: "5px",
              fontSize: "13px",
              color: C.gray,
            }}
          >
            No applications match the
            selected status.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {filtered.map((app) => {
            const isUpdating =
              statusUpdatingId ===
              app.id;

            return (
              <div
                key={app.id}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px",
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow:
                    "0 2px 8px rgba(10,30,60,0.04)",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.blue}, ${C.blueAcc})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {app.initials}
                </div>

                <div
                  style={{
                    flex: "1 1 420px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: C.navy,
                        fontFamily:
                          "'Georgia', serif",
                      }}
                    >
                      {app.name}
                    </span>

                    <StatusBadge
                      status={app.status}
                    />

                    <span
                      style={{
                        marginLeft:
                          "auto",
                        fontSize: "13px",
                        fontWeight: 800,
                        color:
                          app.score >= 85
                            ? C.green
                            : app.score >=
                                70
                              ? C.amber
                              : C.red,
                      }}
                    >
                      ⭐ {app.score}%
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      ["📋", app.role],
                      [
                        "📅",
                        `Applied ${app.applied}`,
                      ],
                      [
                        "📧",
                        app.email ||
                          "No email",
                      ],
                      [
                        "📞",
                        app.phone ||
                          "No phone",
                      ],
                      ["📍", app.loc],
                      ["💰", app.salary],
                    ].map(
                      (
                        [
                          icon,
                          value,
                        ],
                        index
                      ) => (
                        <span
                          key={`${icon}-${index}`}
                          style={{
                            fontSize:
                              "12px",
                            color: C.gray,
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "3px",
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          <span>
                            {icon}
                          </span>

                          {value}
                        </span>
                      )
                    )}
                  </div>

                  {app.status === "Rejected" &&
                    app.rejectionReason && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px 10px",
                          borderRadius: "8px",
                          background: C.redPale,
                          border: `1px solid ${C.redBd}`,
                          fontSize: "11.5px",
                          color: C.red,
                          lineHeight: 1.5,
                        }}
                      >
                        <strong>Rejection reason:</strong>{" "}
                        {app.rejectionReason}
                      </div>
                    )}

                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      marginTop: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {app.skills.length >
                    0 ? (
                      app.skills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={`${skill}-${index}`}
                            style={{
                              padding:
                                "2px 9px",
                              borderRadius:
                                "5px",
                              background:
                                C.grayLight,
                              border: `1px solid ${C.border}`,
                              color:
                                C.grayDark,
                              fontSize:
                                "11px",
                              fontWeight:
                                600,
                            }}
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <span
                        style={{
                          color: C.gray,
                          fontSize:
                            "11px",
                        }}
                      >
                        No skills provided
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "6px",
                    flexShrink: 0,
                    minWidth: "130px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedId(
                        app.id
                      )
                    }
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "none",
                      background: `linear-gradient(135deg, ${C.blue}, ${C.blueAcc})`,
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    View Profile
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
                        style={{
                          padding:
                            "8px 10px",
                          borderRadius:
                            "8px",
                          border: `1.5px solid ${C.greenBd}`,
                          background:
                            C.greenPale,
                          color: C.green,
                          fontSize:
                            "11px",
                          fontWeight: 700,
                          cursor:
                            isUpdating
                              ? "wait"
                              : "pointer",
                          opacity:
                            isUpdating
                              ? 0.6
                              : 1,
                        }}
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
                      style={{
                        padding:
                          "8px 10px",
                        borderRadius:
                          "8px",
                        border: `1.5px solid ${C.redBd}`,
                        background:
                          C.redPale,
                        color: C.red,
                        fontSize:
                          "11px",
                        fontWeight: 700,
                        cursor:
                          isUpdating
                            ? "wait"
                            : "pointer",
                        opacity:
                          isUpdating
                            ? 0.6
                            : 1,
                      }}
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
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: `1px solid ${C.border}`,
                      background:
                        "transparent",
                      color: C.gray,
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}