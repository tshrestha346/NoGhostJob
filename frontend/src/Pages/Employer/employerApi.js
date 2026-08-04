const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Failed to read stored user:",
      error
    );

    return null;
  }
}

function getToken() {
  const user = getStoredUser();

  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    user?.token ||
    ""
  );
}

export function getCurrentEmployer() {
  return getStoredUser();
}

export function getEmployerCompanyId() {
  const user = getStoredUser();

  return (
    user?.company?._id ||
    user?.company?.id ||
    user?.companyId ||
    user?.employerProfile?.company?._id ||
    user?.employerProfile?.companyId ||
    null
  );
}

async function request(
  path,
  options = {}
) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      headers: {
        Accept: "application/json",

        ...(options.body
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export async function getCompanyJobs(
  companyId
) {
  if (!companyId) {
    throw new Error(
      "Company ID was not found."
    );
  }

  const data = await request(
    `/companies/${companyId}/jobs?limit=100`
  );

  return {
    company: data?.company || null,

    jobs: Array.isArray(data?.jobs)
      ? data.jobs
      : [],

    pagination:
      data?.pagination || null,
  };
}

export function createJob(payload) {
  return request("/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateJob(
  jobId,
  payload
) {
  return request(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteJob(jobId) {
  return request(`/jobs/${jobId}`, {
    method: "DELETE",
  });
}

export function updateJobStatus(
  jobId,
  status
) {
  return request(
    `/jobs/${jobId}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({
        status,
      }),
    }
  );
}


export async function getApplicationsForJob(
  jobId
) {
  const data = await request(
    `/applications/job/${jobId}`
  );

  return Array.isArray(data)
    ? data
    : data?.applications || [];
}

export function updateApplicationStatus(
  applicationId,
  status,
  rejectionReason = ""
) {
  return request(
    `/applications/${applicationId}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({
        status,
        rejectionReason,
      }),
    }
  );
}


export function frontendStatusToBackend(
  status
) {
  const map = {
    Applied: "Submitted",
    "Under Review": "Under Review",
    Shortlisted: "Shortlisted",
    Interview: "Interview",
    Rejected: "Rejected",
    Offered: "Hired",
    Hired: "Hired",
  };

  return map[status] || status;
}

export function backendStatusToFrontend(
  status
) {
  const map = {
    Submitted: "Applied",
    "Under Review": "Under Review",
    Shortlisted: "Shortlisted",
    Interview: "Interview",
    Rejected: "Rejected",
    Hired: "Offered",
  };

  return map[status] || status;
}


export function normaliseJob(raw) {
  const company =
    raw?.company || {};

  return {
    ...raw,

    id:
      raw?._id ||
      raw?.id,

    companyId:
      company?._id ||
      company?.id ||
      raw?.companyId ||
      raw?.company,

    companyName:
      company?.name ||
      raw?.companyName ||
      "Company",

    title:
      raw?.title ||
      raw?.jobTitle ||
      "Untitled Job",

    dept:
      raw?.department ||
      raw?.dept ||
      raw?.category ||
      "General",

    type:
      raw?.jobType ||
      raw?.type ||
      "Full Time",

    loc:
      raw?.location ||
      raw?.loc ||
      "Not specified",

    salary:
      raw?.salaryRange ||
      raw?.salary ||
      raw?.sal ||
      "Not specified",

    desc:
      raw?.description ||
      raw?.desc ||
      "",

    status:
      raw?.status ||
      (
        raw?.isActive === false
          ? "Closed"
          : "Active"
      ),

    posted: raw?.createdAt
      ? new Date(
          raw.createdAt
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : raw?.posted ||
        "Recently",

    apps:
      raw?.applicationCount ??
      raw?.applicationsCount ??
      raw?.apps ??
      raw?.applications?.length ??
      0,

    views:
      raw?.views ??
      raw?.viewCount ??
      0,
  };
}


function createInitials(
  name = "Applicant"
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part[0]?.toUpperCase()
    )
    .join("");
}


export function normaliseApplication(
  raw,
  fallbackJob = null
) {
  const user =
    raw?.applicant ||
    raw?.user ||
    raw?.candidate ||
    {};

  const profile =
    user?.profile ||
    raw?.profile ||
    {};

  const job =
    raw?.job ||
    raw?.jobSnapshot ||
    fallbackJob ||
    {};

  const name =
    user?.fullName ||
    user?.name ||
    raw?.fullName ||
    raw?.name ||
    "Applicant";

  const rawSkills =
    profile?.skills ||
    user?.skills ||
    raw?.skills ||
    raw?.resumeSnapshot?.skills ||
    [];

  const skills =
    Array.isArray(rawSkills)
      ? rawSkills
      : typeof rawSkills === "string"
        ? rawSkills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(Boolean)
        : [];

  const rawStatus =
    raw?.status || "Submitted";

  return {
    ...raw,

    id:
      raw?._id ||
      raw?.id,

    userId:
      user?._id ||
      user?.id ||
      raw?.userId,

    jobId:
      job?._id ||
      job?.id ||
      raw?.jobId ||
      fallbackJob?.id,

    name,

    initials:
      createInitials(name),

    email:
      user?.email ||
      raw?.email ||
      "Not provided",

    phone:
      profile?.phoneNo ||
      user?.phoneNo ||
      raw?.phoneNo ||
      raw?.phone ||
      "Not provided",

    role:
      job?.title ||
      job?.jobTitle ||
      fallbackJob?.title ||
      "Applicant",

    backendStatus:
      rawStatus,

    status:
      backendStatusToFrontend(
        rawStatus
      ),

    applied: raw?.createdAt
      ? new Date(
          raw.createdAt
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : raw?.applied ||
        "Recently",

    loc:
      profile?.address?.city ||
      profile?.city ||
      user?.location ||
      raw?.location ||
      "Not provided",

    exp:
      profile?.experience ||
      raw?.experience ||
      "Not provided",

    salary:
      raw?.expectedSalary ||
      profile?.expectedSalary ||
      "Not provided",

    score:
      raw?.matchScore ??
      raw?.score ??
      0,

    skills,

    coverLetter:
      raw?.coverLetter ||
      "",

    cvUrl:
      raw?.cvUrl ||
      raw?.resumeUrl ||
      raw?.cv?.url ||
      user?.cv?.url ||
      profile?.cvUrl ||
      "",

    education:
      profile?.education ||
      raw?.education ||
      [],

    experienceDetails:
      profile?.workExperience ||
      raw?.workExperience ||
      [],
  };
}