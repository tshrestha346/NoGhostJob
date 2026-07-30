const API_URL = "http://localhost:5000/api";

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
    console.error(
      "Failed to read stored user:",
      error
    );

    return null;
  }
}

function getStoredUserId() {
  const user = getStoredUser();

  return user?._id || user?.id || null;
}

function getStoredToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null
  );
}

/*
|--------------------------------------------------------------------------
| Request helpers
|--------------------------------------------------------------------------
*/

function getAuthHeaders() {
  const token = getStoredToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          String(value)
        );
      }
    }
  );

  const queryString =
    searchParams.toString();

  return queryString
    ? `?${queryString}`
    : "";
}

/*
|--------------------------------------------------------------------------
| Response handler
|--------------------------------------------------------------------------
*/

async function handleResponse(response) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Jobs
|--------------------------------------------------------------------------
*/

/**
 * Fetch all jobs with optional keyword
 * and location filtering.
 *
 * Backend:
 * GET /api/jobs?keyword=developer&loc=Berlin
 */
export async function fetchJobs(
  keyword = "",
  loc = ""
) {
  const queryString = buildQueryString({
    keyword,
    loc,
  });

  const response = await fetch(
    `${API_URL}/jobs${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/**
 * Fetch one job by ID.
 *
 * Backend:
 * GET /api/jobs/:jobId
 */
export async function fetchJobById(
  jobId
) {
  if (!jobId) {
    throw new Error(
      "Job ID is required."
    );
  }

  const response = await fetch(
    `${API_URL}/jobs/${jobId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/*
|--------------------------------------------------------------------------
| Companies
|--------------------------------------------------------------------------
*/

/**
 * Fetch companies with optional search,
 * filters, sorting and pagination.
 *
 * Supported options:
 *
 * search
 * industry
 * size
 * type
 * tag
 * sort
 * page
 * limit
 *
 * Example:
 *
 * fetchCompanies({
 *   search: "Google",
 *   industry: "Technology",
 *   size: "100,000+",
 *   type: "Public",
 *   tag: "Remote Friendly",
 *   sort: "openings",
 *   page: 1,
 *   limit: 12,
 * });
 *
 * Backend:
 * GET /api/companies
 */
export async function fetchCompanies(
  options = {}
) {
  const {
    search = "",
    industry = "",
    size = "",
    type = "",
    tag = "",
    sort = "top",
    page = 1,
    limit = 12,
  } = options;

  const queryString = buildQueryString({
    search,
    industry,
    size,
    type,
    tag,
    sort,
    page,
    limit,
  });

  const response = await fetch(
    `${API_URL}/companies${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/**
 * Fetch one company by MongoDB ID.
 *
 * Backend:
 * GET /api/companies/:companyId
 */
export async function fetchCompanyById(
  companyId
) {
  if (!companyId) {
    throw new Error(
      "Company ID is required."
    );
  }

  const response = await fetch(
    `${API_URL}/companies/${companyId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/**
 * Fetch all jobs belonging to one company.
 *
 * Supported options:
 *
 * search
 * location
 * jobType
 * experience
 * sort
 * page
 * limit
 *
 * Backend:
 * GET /api/companies/:companyId/jobs
 */
export async function fetchCompanyJobs(
  companyId,
  options = {}
) {
  if (!companyId) {
    throw new Error(
      "Company ID is required."
    );
  }

  const {
    search = "",
    location = "",
    jobType = "",
    experience = "",
    sort = "newest",
    page = 1,
    limit = 12,
  } = options;

  const queryString = buildQueryString({
    search,
    location,
    jobType,
    experience,
    sort,
    page,
    limit,
  });

  const response = await fetch(
    `${API_URL}/companies/${companyId}/jobs${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/**
 * Create a new company.
 *
 * Backend:
 * POST /api/companies
 */
export async function createCompany(
  companyData
) {
  if (
    !companyData ||
    typeof companyData !== "object"
  ) {
    throw new Error(
      "Company data is required."
    );
  }

  const response = await fetch(
    `${API_URL}/companies`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(
        companyData
      ),
    }
  );

  return handleResponse(response);
}

/**
 * Update an existing company.
 *
 * Backend:
 * PUT /api/companies/:companyId
 */
export async function updateCompany(
  companyId,
  companyData
) {
  if (!companyId) {
    throw new Error(
      "Company ID is required."
    );
  }

  if (
    !companyData ||
    typeof companyData !== "object"
  ) {
    throw new Error(
      "Company data is required."
    );
  }

  const response = await fetch(
    `${API_URL}/companies/${companyId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(
        companyData
      ),
    }
  );

  return handleResponse(response);
}

/**
 * Partially update a company.
 *
 * Backend:
 * PATCH /api/companies/:companyId
 */
export async function patchCompany(
  companyId,
  companyData
) {
  if (!companyId) {
    throw new Error(
      "Company ID is required."
    );
  }

  if (
    !companyData ||
    typeof companyData !== "object"
  ) {
    throw new Error(
      "Company data is required."
    );
  }

  const response = await fetch(
    `${API_URL}/companies/${companyId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(
        companyData
      ),
    }
  );

  return handleResponse(response);
}

/**
 * Delete a company.
 *
 * Backend:
 * DELETE /api/companies/:companyId
 */
export async function deleteCompany(
  companyId
) {
  if (!companyId) {
    throw new Error(
      "Company ID is required."
    );
  }

  const response = await fetch(
    `${API_URL}/companies/${companyId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
`*/

export async function fetchCategories() {
  const response = await fetch(
    `${API_URL}/categories`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/*
|--------------------------------------------------------------------------
| Testimonials
|--------------------------------------------------------------------------
*/

export async function fetchTestimonials() {
  const response = await fetch(
    `${API_URL}/testimonials`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/*
|--------------------------------------------------------------------------
| Newsletter
|--------------------------------------------------------------------------
*/

export async function subscribeNewsletter(
  email
) {
  if (!email?.trim()) {
    throw new Error(
      "Email address is required."
    );
  }

  const response = await fetch(
    `${API_URL}/newsletter`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email: email.trim(),
      }),
    }
  );

  return handleResponse(response);
}

/*
|--------------------------------------------------------------------------
| Applications
|--------------------------------------------------------------------------
*/

/**
 * Apply for a job.
 *
 * The backend obtains the current user
 * from the authentication token.
 *
 * Backend:
 * POST /api/applications/:jobId/apply
 */
export async function applyForJob(
  jobId
) {
  if (!jobId) {
    throw new Error(
      "Job ID is required."
    );
  }

  const token = getStoredToken();

  if (!token) {
    throw new Error(
      "You must log in before applying for a job."
    );
  }

  const response = await fetch(
    `${API_URL}/applications/${jobId}/apply`,
    {
      method: "POST",

      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}

/**
 * Check whether the current user has
 * already applied for a job.
 *
 * Backend:
 * GET /api/applications/:jobId/status
 */
export async function checkApplicationStatus(
  jobId
) {
  if (!jobId) {
    throw new Error(
      "Job ID is required."
    );
  }

  const token = getStoredToken();

  if (!token) {
    return {
      applied: false,
      application: null,
    };
  }

  const response = await fetch(
    `${API_URL}/applications/${jobId}/status`,
    {
      method: "GET",

      headers: getAuthHeaders(),

      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/**
 * Get all applications submitted by
 * the currently logged-in user.
 *
 * Backend:
 * GET /api/applications/my-applications
 */
export async function fetchMyApplications() {
  const token = getStoredToken();

  if (!token) {
    throw new Error(
      "You must log in to view your applications."
    );
  }

  const response = await fetch(
    `${API_URL}/applications/my-applications`,
    {
      method: "GET",

      headers: getAuthHeaders(),

      cache: "no-store",
    }
  );

  return handleResponse(response);
}

/*
|--------------------------------------------------------------------------
| Export helpers
|--------------------------------------------------------------------------
*/

export {
  getStoredUser,
  getStoredUserId,
  getStoredToken,
};