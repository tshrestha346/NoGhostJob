require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Company = require("./models/Company");
const Job = require("./models/Job");


const SEED_PREFIX = "seedcompany";
const JOBS_PER_COMPANY = 3;
const BCRYPT_ROUNDS = 10;


const COMPANIES = [
  {
    name: "NovaByte Technologies",
    initials: "NB",
    color: "#2563EB",
    industry: "Technology",
    location: "Berlin, Germany",
    size: "51-200 employees",
    website: "https://novabyte.example",
    description:
      "NovaByte Technologies builds modern cloud platforms and digital products for international businesses.",
    founded: 2018,
    rating: 4.8,
  },
  {
    name: "CloudNest Systems",
    initials: "CN",
    color: "#0284C7",
    industry: "Cloud Computing",
    location: "Hamburg, Germany",
    size: "201-500 employees",
    website: "https://cloudnest.example",
    description:
      "CloudNest Systems provides secure cloud infrastructure and enterprise migration services.",
    founded: 2016,
    rating: 4.7,
  },
  {
    name: "Finora Digital",
    initials: "FD",
    color: "#059669",
    industry: "FinTech",
    location: "Frankfurt, Germany",
    size: "201-500 employees",
    website: "https://finora.example",
    description:
      "Finora Digital develops payment, banking and financial management products.",
    founded: 2017,
    rating: 4.6,
  },
  {
    name: "PixelForge Studio",
    initials: "PF",
    color: "#7C3AED",
    industry: "Design Tools",
    location: "Munich, Germany",
    size: "11-50 employees",
    website: "https://pixelforge.example",
    description:
      "PixelForge Studio creates accessible design systems and collaborative digital tools.",
    founded: 2020,
    rating: 4.7,
  },
  {
    name: "GreenCart Commerce",
    initials: "GC",
    color: "#16A34A",
    industry: "E-Commerce",
    location: "Cologne, Germany",
    size: "51-200 employees",
    website: "https://greencart.example",
    description:
      "GreenCart Commerce operates sustainable online marketplaces and logistics products.",
    founded: 2019,
    rating: 4.5,
  },
  {
    name: "DataSphere Analytics",
    initials: "DS",
    color: "#4F46E5",
    industry: "Data Analytics",
    location: "Berlin, Germany",
    size: "51-200 employees",
    website: "https://datasphere.example",
    description:
      "DataSphere Analytics helps organisations turn complex data into business decisions.",
    founded: 2018,
    rating: 4.8,
  },
  {
    name: "SecureWave Cybersecurity",
    initials: "SW",
    color: "#DC2626",
    industry: "Cybersecurity",
    location: "Düsseldorf, Germany",
    size: "201-500 employees",
    website: "https://securewave.example",
    description:
      "SecureWave protects organisations through managed security and incident response services.",
    founded: 2015,
    rating: 4.9,
  },
  {
    name: "BrightPath Education",
    initials: "BE",
    color: "#EA580C",
    industry: "EdTech",
    location: "Leipzig, Germany",
    size: "51-200 employees",
    website: "https://brightpath.example",
    description:
      "BrightPath creates learning platforms for students, teachers and universities.",
    founded: 2019,
    rating: 4.6,
  },
  {
    name: "MediCore Health",
    initials: "MH",
    color: "#0891B2",
    industry: "HealthTech",
    location: "Heidelberg, Germany",
    size: "201-500 employees",
    website: "https://medicore.example",
    description:
      "MediCore Health builds secure software for hospitals, clinics and healthcare providers.",
    founded: 2014,
    rating: 4.7,
  },
  {
    name: "UrbanMove Mobility",
    initials: "UM",
    color: "#0F766E",
    industry: "Mobility",
    location: "Stuttgart, Germany",
    size: "501-1,000 employees",
    website: "https://urbanmove.example",
    description:
      "UrbanMove develops connected transport and sustainable mobility solutions.",
    founded: 2013,
    rating: 4.5,
  },
  {
    name: "TravelMint",
    initials: "TM",
    color: "#0369A1",
    industry: "Travel",
    location: "Berlin, Germany",
    size: "51-200 employees",
    website: "https://travelmint.example",
    description:
      "TravelMint helps travellers discover and manage accommodation and experiences.",
    founded: 2018,
    rating: 4.4,
  },
  {
    name: "WorkFlowly",
    initials: "WF",
    color: "#9333EA",
    industry: "Productivity SaaS",
    location: "Hamburg, Germany",
    size: "51-200 employees",
    website: "https://workflowly.example",
    description:
      "WorkFlowly provides collaborative project and workflow software.",
    founded: 2020,
    rating: 4.7,
  },
  {
    name: "VisionAI Labs",
    initials: "VA",
    color: "#6D28D9",
    industry: "Artificial Intelligence",
    location: "Munich, Germany",
    size: "51-200 employees",
    website: "https://visionailabs.example",
    description:
      "VisionAI Labs develops responsible machine-learning and automation products.",
    founded: 2019,
    rating: 4.9,
  },
  {
    name: "StreamNova Entertainment",
    initials: "SN",
    color: "#E11D48",
    industry: "Entertainment",
    location: "Berlin, Germany",
    size: "201-500 employees",
    website: "https://streamnova.example",
    description:
      "StreamNova delivers streaming, media discovery and content management experiences.",
    founded: 2016,
    rating: 4.6,
  },
  {
    name: "SocialBridge Media",
    initials: "SB",
    color: "#2563EB",
    industry: "Social Media",
    location: "Cologne, Germany",
    size: "51-200 employees",
    website: "https://socialbridge.example",
    description:
      "SocialBridge builds communication and community management tools.",
    founded: 2019,
    rating: 4.5,
  },
  {
    name: "RetailPulse",
    initials: "RP",
    color: "#C2410C",
    industry: "Retail Technology",
    location: "Dortmund, Germany",
    size: "201-500 employees",
    website: "https://retailpulse.example",
    description:
      "RetailPulse develops retail analytics and inventory management products.",
    founded: 2015,
    rating: 4.4,
  },
  {
    name: "LegalEase Solutions",
    initials: "LE",
    color: "#475569",
    industry: "LegalTech",
    location: "Frankfurt, Germany",
    size: "51-200 employees",
    website: "https://legalease.example",
    description:
      "LegalEase provides document, compliance and contract management technology.",
    founded: 2017,
    rating: 4.6,
  },
  {
    name: "PropNest",
    initials: "PN",
    color: "#B45309",
    industry: "PropTech",
    location: "Berlin, Germany",
    size: "51-200 employees",
    website: "https://propnest.example",
    description:
      "PropNest simplifies property search, rental management and tenant communication.",
    founded: 2018,
    rating: 4.5,
  },
  {
    name: "FoodLoop Delivery",
    initials: "FL",
    color: "#DC2626",
    industry: "Food Technology",
    location: "Hamburg, Germany",
    size: "501-1,000 employees",
    website: "https://foodloop.example",
    description:
      "FoodLoop creates ordering, logistics and restaurant management technology.",
    founded: 2014,
    rating: 4.3,
  },
  {
    name: "EnergyGrid Solutions",
    initials: "EG",
    color: "#15803D",
    industry: "Clean Energy",
    location: "Essen, Germany",
    size: "201-500 employees",
    website: "https://energygrid.example",
    description:
      "EnergyGrid develops software for renewable-energy monitoring and optimisation.",
    founded: 2012,
    rating: 4.8,
  },
  {
    name: "AutoLogic Engineering",
    initials: "AE",
    color: "#334155",
    industry: "Automotive Technology",
    location: "Stuttgart, Germany",
    size: "1,000-5,000 employees",
    website: "https://autologic.example",
    description:
      "AutoLogic develops connected vehicle and manufacturing software.",
    founded: 2010,
    rating: 4.5,
  },
  {
    name: "CodeCraft Consulting",
    initials: "CC",
    color: "#1D4ED8",
    industry: "IT Consulting",
    location: "Dresden, Germany",
    size: "201-500 employees",
    website: "https://codecraft.example",
    description:
      "CodeCraft delivers software engineering and cloud transformation services.",
    founded: 2013,
    rating: 4.7,
  },
  {
    name: "TalentOrbit",
    initials: "TO",
    color: "#7E22CE",
    industry: "HR Technology",
    location: "Berlin, Germany",
    size: "51-200 employees",
    website: "https://talentorbit.example",
    description:
      "TalentOrbit develops recruitment, onboarding and workforce management products.",
    founded: 2019,
    rating: 4.6,
  },
  {
    name: "MarketSpark",
    initials: "MS",
    color: "#DB2777",
    industry: "Marketing Technology",
    location: "Munich, Germany",
    size: "51-200 employees",
    website: "https://marketspark.example",
    description:
      "MarketSpark provides campaign automation and customer analytics software.",
    founded: 2018,
    rating: 4.5,
  },
  {
    name: "QuantumWorks Research",
    initials: "QW",
    color: "#4338CA",
    industry: "Deep Technology",
    location: "Karlsruhe, Germany",
    size: "11-50 employees",
    website: "https://quantumworks.example",
    description:
      "QuantumWorks develops experimental computing and advanced software systems.",
    founded: 2021,
    rating: 4.9,
  },
];


const INDUSTRY_JOB_TEMPLATES = {
  Technology: [
    {
      title: "Frontend React Developer",
      skills: [
        "React",
        "JavaScript",
        "TypeScript",
        "Tailwind CSS",
        "REST APIs",
      ],
      experienceLevel: "Mid Level",
      jobType: "Full-time",
    },
    {
      title: "Backend Node.js Developer",
      skills: [
        "Node.js",
        "Express",
        "MongoDB",
        "Docker",
        "REST APIs",
      ],
      experienceLevel: "Mid Level",
      jobType: "Full-time",
    },
    {
      title: "Working Student Software Engineering",
      skills: ["JavaScript", "React", "Node.js", "Git"],
      experienceLevel: "Entry Level",
      jobType: "Working Student",
    },
  ],

  "Cloud Computing": [
    {
      title: "Cloud Platform Engineer",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
      experienceLevel: "Mid Level",
      jobType: "Full-time",
    },
    {
      title: "DevOps Engineer",
      skills: [
        "CI/CD",
        "GitHub Actions",
        "Docker",
        "Kubernetes",
        "Monitoring",
      ],
      experienceLevel: "Senior",
      jobType: "Full-time",
    },
    {
      title: "Cloud Engineering Intern",
      skills: ["Linux", "Networking", "AWS", "Git"],
      experienceLevel: "Entry Level",
      jobType: "Internship",
    },
  ],

  FinTech: [
    {
      title: "Full Stack Developer",
      skills: [
        "React",
        "Node.js",
        "PostgreSQL",
        "TypeScript",
        "REST APIs",
      ],
      experienceLevel: "Mid Level",
      jobType: "Full-time",
    },
    {
      title: "Financial Data Analyst",
      skills: ["SQL", "Python", "Power BI", "Excel", "Data Analysis"],
      experienceLevel: "Junior",
      jobType: "Full-time",
    },
    {
      title: "FinTech Working Student",
      skills: ["Excel", "SQL", "JavaScript", "Financial Analysis"],
      experienceLevel: "Entry Level",
      jobType: "Working Student",
    },
  ],

  Cybersecurity: [
    {
      title: "Cybersecurity Analyst",
      skills: [
        "SIEM",
        "Network Security",
        "Incident Response",
        "Linux",
        "Wireshark",
      ],
      experienceLevel: "Junior",
      jobType: "Full-time",
    },
    {
      title: "Penetration Tester",
      skills: [
        "Kali Linux",
        "Burp Suite",
        "OWASP",
        "Metasploit",
        "Python",
      ],
      experienceLevel: "Mid Level",
      jobType: "Full-time",
    },
    {
      title: "Information Security Working Student",
      skills: [
        "ISO 27001",
        "Risk Assessment",
        "Networking",
        "Security Monitoring",
      ],
      experienceLevel: "Entry Level",
      jobType: "Working Student",
    },
  ],

  "Artificial Intelligence": [
    {
      title: "Machine Learning Engineer",
      skills: [
        "Python",
        "PyTorch",
        "TensorFlow",
        "Machine Learning",
        "Docker",
      ],
      experienceLevel: "Mid Level",
      jobType: "Full-time",
    },
    {
      title: "Data Scientist",
      skills: [
        "Python",
        "SQL",
        "Pandas",
        "Scikit-learn",
        "Statistics",
      ],
      experienceLevel: "Mid Level",
      jobType: "Full-time",
    },
    {
      title: "AI Research Intern",
      skills: [
        "Python",
        "Machine Learning",
        "Data Analysis",
        "Jupyter",
      ],
      experienceLevel: "Entry Level",
      jobType: "Internship",
    },
  ],
};

const DEFAULT_JOB_TEMPLATES = [
  {
    title: "Frontend Developer",
    skills: ["React", "JavaScript", "HTML", "CSS", "REST APIs"],
    experienceLevel: "Mid Level",
    jobType: "Full-time",
  },
  {
    title: "Product Operations Specialist",
    skills: [
      "Project Management",
      "Communication",
      "Analytics",
      "Agile",
    ],
    experienceLevel: "Junior",
    jobType: "Full-time",
  },
  {
    title: "Working Student Digital Operations",
    skills: [
      "Microsoft Office",
      "Communication",
      "Data Entry",
      "Teamwork",
    ],
    experienceLevel: "Entry Level",
    jobType: "Working Student",
  },
];


function hasSchemaPath(model, path) {
  return Boolean(model.schema.path(path));
}

function getSchemaPath(model, path) {
  return model.schema.path(path) || null;
}

function getSchemaEnumValues(model, path) {
  const schemaPath = getSchemaPath(model, path);

  if (!schemaPath) {
    return [];
  }

  return Array.isArray(schemaPath.enumValues)
    ? schemaPath.enumValues
    : [];
}

function normaliseEnumValue(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function findMatchingEnumValue(model, path, requestedValue) {
  const enumValues = getSchemaEnumValues(model, path);

  if (enumValues.length === 0) {
    return requestedValue;
  }

  const requested = normaliseEnumValue(requestedValue);

  return (
    enumValues.find(
      (enumValue) =>
        normaliseEnumValue(enumValue) === requested
    ) || null
  );
}

function isSchemaPathRequired(model, path) {
  const schemaPath = getSchemaPath(model, path);

  if (!schemaPath) {
    return false;
  }

  return Boolean(schemaPath.isRequired);
}

function addFieldWhenSupported(model, target, path, value) {
  if (
    value === undefined ||
    value === null ||
    !hasSchemaPath(model, path)
  ) {
    return;
  }

  const enumValues = getSchemaEnumValues(model, path);

  if (enumValues.length === 0) {
    target[path] = value;
    return;
  }

  const matchingValue = findMatchingEnumValue(
    model,
    path,
    value
  );

  if (matchingValue !== null) {
    target[path] = matchingValue;
    return;
  }

  console.warn(
    `Skipping ${path}="${value}". Allowed values: ${enumValues.join(
      ", "
    )}`
  );
}


function addJobTypeFields(target, requestedJobType) {
  const employmentFields = [
    "jobType",
    "employmentType",
  ];

  employmentFields.forEach((field) => {
    if (!hasSchemaPath(Job, field)) {
      return;
    }

    const enumValues = getSchemaEnumValues(Job, field);

    if (enumValues.length === 0) {
      target[field] = requestedJobType;
      return;
    }

    const matchingValue = findMatchingEnumValue(
      Job,
      field,
      requestedJobType
    );

    if (matchingValue !== null) {
      target[field] = matchingValue;
      return;
    }


    const alternatives = {
      "Full-time": [
        "Full Time",
        "Fulltime",
        "full_time",
        "fulltime",
        "Permanent",
      ],
      "Part-time": [
        "Part Time",
        "Parttime",
        "part_time",
        "parttime",
      ],
      Internship: [
        "Intern",
        "Trainee",
      ],
      Contract: [
        "Contractor",
        "Temporary",
      ],
      "Working Student": [
        "Working student",
        "Student",
        "Werkstudent",
        "Part-time",
        "Part Time",
      ],
    };

    const possibleValues = alternatives[requestedJobType] || [];

    for (const possibleValue of possibleValues) {
      const alternativeMatch = findMatchingEnumValue(
        Job,
        field,
        possibleValue
      );

      if (alternativeMatch !== null) {
        target[field] = alternativeMatch;
        return;
      }
    }

    if (isSchemaPathRequired(Job, field)) {
      target[field] = enumValues[0];

      console.warn(
        `${field} is required. Using "${enumValues[0]}" instead of "${requestedJobType}".`
      );
    }
  });
}


function addWorkplaceType(target, jobIndex) {
  if (!hasSchemaPath(Job, "type")) {
    return;
  }

  const enumValues = getSchemaEnumValues(Job, "type");

  const preferredTypes =
    jobIndex === 2
      ? [
          "Remote",
          "remote",
          "Hybrid",
          "hybrid",
          "On-site",
          "Onsite",
        ]
      : [
          "On-site",
          "Onsite",
          "Office",
          "Hybrid",
          "Remote",
        ];

  if (enumValues.length === 0) {
    target.type = jobIndex === 2 ? "Remote" : "On-site";
    return;
  }

  for (const preferredType of preferredTypes) {
    const matchingValue = findMatchingEnumValue(
      Job,
      "type",
      preferredType
    );

    if (matchingValue !== null) {
      target.type = matchingValue;
      return;
    }
  }


  if (isSchemaPathRequired(Job, "type")) {
    target.type = enumValues[0];

    console.warn(
      `Job.type is required. Using valid enum value "${enumValues[0]}".`
    );
  }
}


function addJobStatusFields(target) {
  if (hasSchemaPath(Job, "status")) {
    const statusEnums = getSchemaEnumValues(Job, "status");

    const preferredStatuses = [
      "Active",
      "Published",
      "Open",
      "Approved",
      "Live",
      "Draft",
    ];

    if (statusEnums.length === 0) {
      target.status = "Active";
    } else {
      let selectedStatus = null;

      for (const preferredStatus of preferredStatuses) {
        selectedStatus = findMatchingEnumValue(
          Job,
          "status",
          preferredStatus
        );

        if (selectedStatus !== null) {
          break;
        }
      }

      if (selectedStatus !== null) {
        target.status = selectedStatus;
      } else {
        target.status = statusEnums[0];

        console.warn(
          `Using valid status "${statusEnums[0]}". Available values: ${statusEnums.join(
            ", "
          )}`
        );
      }
    }
  }

  addFieldWhenSupported(
    Job,
    target,
    "isActive",
    true
  );

  addFieldWhenSupported(
    Job,
    target,
    "active",
    true
  );

  addFieldWhenSupported(
    Job,
    target,
    "isPublished",
    true
  );

  addFieldWhenSupported(
    Job,
    target,
    "published",
    true
  );
}

/*
|--------------------------------------------------------------------------
| General helpers
|--------------------------------------------------------------------------
*/

function createSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 25);
}

function createEmployerCredentials(company, index) {
  const slug = createSlug(company.name);
  const number = String(index + 1).padStart(2, "0");

  return {
    email: `${SEED_PREFIX}.${slug}${number}@gmail.com`,
    password: `Employer@${number}26`,
  };
}

function createSalary(companyIndex, jobIndex) {
  const minimum =
    42000 +
    companyIndex * 750 +
    jobIndex * 2000;

  return {
    min: minimum,
    max: minimum + 12000,
    currency: "EUR",
    period: "year",
  };
}

function createJobDescription(company, template) {
  return `${company.name} is looking for a ${template.title} to join its ${company.industry} team in ${company.location}. The successful candidate will collaborate with product, engineering and business teams to deliver reliable solutions.`;
}

function createJobRequirements(template) {
  return [
    `Knowledge of ${template.skills.slice(0, 3).join(", ")}`,
    "Strong communication and teamwork skills",
    "Ability to work independently and manage priorities",
    "Interest in modern tools and technologies",
  ];
}

function createJobResponsibilities(template) {
  return [
    `Contribute to projects involving ${template.skills
      .slice(0, 2)
      .join(" and ")}`,
    "Collaborate with cross-functional team members",
    "Participate in implementation, testing and documentation",
    "Communicate work progress clearly",
  ];
}

/*
|--------------------------------------------------------------------------
| Company data builder
|--------------------------------------------------------------------------
*/

function buildCompanyData(companyData, employerId) {
  const data = {};

  addFieldWhenSupported(
    Company,
    data,
    "name",
    companyData.name
  );

  addFieldWhenSupported(
    Company,
    data,
    "initials",
    companyData.initials
  );

  addFieldWhenSupported(
    Company,
    data,
    "color",
    companyData.color
  );

  addFieldWhenSupported(
    Company,
    data,
    "industry",
    companyData.industry
  );

  addFieldWhenSupported(
    Company,
    data,
    "location",
    companyData.location
  );

  addFieldWhenSupported(
    Company,
    data,
    "size",
    companyData.size
  );

  addFieldWhenSupported(
    Company,
    data,
    "website",
    companyData.website
  );

  addFieldWhenSupported(
    Company,
    data,
    "description",
    companyData.description
  );

  addFieldWhenSupported(
    Company,
    data,
    "founded",
    companyData.founded
  );

  addFieldWhenSupported(
    Company,
    data,
    "rating",
    companyData.rating
  );

  addFieldWhenSupported(
    Company,
    data,
    "reviews",
    100 + Math.floor(Math.random() * 900)
  );

  addFieldWhenSupported(
    Company,
    data,
    "owner",
    employerId
  );

  addFieldWhenSupported(
    Company,
    data,
    "employer",
    employerId
  );

  addFieldWhenSupported(
    Company,
    data,
    "isActive",
    true
  );

  addFieldWhenSupported(
    Company,
    data,
    "isVerified",
    true
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| Job data builder
|--------------------------------------------------------------------------
*/

function buildJobData({
  company,
  companyId,
  employerId,
  template,
  companyIndex,
  jobIndex,
}) {
  const data = {};

  const salary = createSalary(
    companyIndex,
    jobIndex
  );

  const description = createJobDescription(
    company,
    template
  );

  const requirements =
    createJobRequirements(template);

  const responsibilities =
    createJobResponsibilities(template);

  /*
  |--------------------------------------------------------------------------
  | Basic information
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "title",
    template.title
  );

  addFieldWhenSupported(
    Job,
    data,
    "company",
    companyId
  );

  addFieldWhenSupported(
    Job,
    data,
    "companyId",
    companyId
  );

  addFieldWhenSupported(
    Job,
    data,
    "company_id",
    companyId
  );

  /*
  |--------------------------------------------------------------------------
  | Employer ownership
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "employer",
    employerId
  );

  addFieldWhenSupported(
    Job,
    data,
    "owner",
    employerId
  );

  addFieldWhenSupported(
    Job,
    data,
    "postedBy",
    employerId
  );

  addFieldWhenSupported(
    Job,
    data,
    "createdBy",
    employerId
  );

  addFieldWhenSupported(
    Job,
    data,
    "user",
    employerId
  );

  /*
  |--------------------------------------------------------------------------
  | Company and location
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "companyName",
    company.name
  );

  addFieldWhenSupported(
    Job,
    data,
    "location",
    company.location
  );

  /*
  |--------------------------------------------------------------------------
  | Description
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "description",
    description
  );

  addFieldWhenSupported(
    Job,
    data,
    "shortDescription",
    description
  );

  addFieldWhenSupported(
    Job,
    data,
    "summary",
    description
  );

  /*
  |--------------------------------------------------------------------------
  | Skills and requirements
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "skills",
    template.skills
  );

  addFieldWhenSupported(
    Job,
    data,
    "requirements",
    requirements
  );

  addFieldWhenSupported(
    Job,
    data,
    "responsibilities",
    responsibilities
  );

  /*
  |--------------------------------------------------------------------------
  | Employment type
  |--------------------------------------------------------------------------
  */

  addJobTypeFields(
    data,
    template.jobType
  );

  /*
  |--------------------------------------------------------------------------
  | Workplace type
  |--------------------------------------------------------------------------
  |
  | This is separate from employment type.
  |
  */

  addWorkplaceType(
    data,
    jobIndex
  );

  /*
  |--------------------------------------------------------------------------
  | Experience
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "experienceLevel",
    template.experienceLevel
  );

  addFieldWhenSupported(
    Job,
    data,
    "experience",
    template.experienceLevel
  );

  /*
  |--------------------------------------------------------------------------
  | Salary
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "salary",
    salary
  );

  addFieldWhenSupported(
    Job,
    data,
    "salaryMin",
    salary.min
  );

  addFieldWhenSupported(
    Job,
    data,
    "salaryMax",
    salary.max
  );

  addFieldWhenSupported(
    Job,
    data,
    "salaryCurrency",
    salary.currency
  );

  addFieldWhenSupported(
    Job,
    data,
    "salaryPeriod",
    salary.period
  );

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  addJobStatusFields(data);

  /*
  |--------------------------------------------------------------------------
  | Additional values
  |--------------------------------------------------------------------------
  */

  addFieldWhenSupported(
    Job,
    data,
    "featured",
    jobIndex === 0
  );

  addFieldWhenSupported(
    Job,
    data,
    "remote",
    jobIndex === 2
  );

  addFieldWhenSupported(
    Job,
    data,
    "vacancies",
    1 + (jobIndex % 3)
  );

  addFieldWhenSupported(
    Job,
    data,
    "openings",
    1 + (jobIndex % 3)
  );

  addFieldWhenSupported(
    Job,
    data,
    "applicationDeadline",
    new Date(
      Date.now() +
        (30 + jobIndex * 10) *
          24 *
          60 *
          60 *
          1000
    )
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| Determine company field in Job model
|--------------------------------------------------------------------------
*/

function getJobCompanyField() {
  if (hasSchemaPath(Job, "company")) {
    return "company";
  }

  if (hasSchemaPath(Job, "companyId")) {
    return "companyId";
  }

  if (hasSchemaPath(Job, "company_id")) {
    return "company_id";
  }

  throw new Error(
    "Job model must contain company, companyId or company_id."
  );
}

/*
|--------------------------------------------------------------------------
| Seed employer
|--------------------------------------------------------------------------
*/

async function seedEmployer(companyData, companyIndex) {
  const credentials = createEmployerCredentials(
    companyData,
    companyIndex
  );

  const normalisedEmail = credentials.email
    .trim()
    .toLowerCase();

  const hashedPassword = await bcrypt.hash(
    credentials.password,
    BCRYPT_ROUNDS
  );

  let employer = await User.findOne({
    email: normalisedEmail,
  });

  if (!employer) {
    employer = await User.create({
      fullName: `${companyData.name} Employer`,
      email: normalisedEmail,
      password: hashedPassword,
      accountType: "employer",
      termsAndCondition: true,
      isActive: true,
      isAdmin: false,
    });

    console.log(
      `Employer created: ${normalisedEmail}`
    );
  } else {
    employer.fullName =
      `${companyData.name} Employer`;

    employer.email = normalisedEmail;
    employer.password = hashedPassword;
    employer.accountType = "employer";
    employer.termsAndCondition = true;
    employer.isActive = true;
    employer.isAdmin = false;

    await employer.save();

    console.log(
      `Employer updated: ${normalisedEmail}`
    );
  }

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    employer.password
  );

  if (!passwordMatches) {
    throw new Error(
      `Password verification failed for ${normalisedEmail}. Check whether your User model hashes passwords automatically.`
    );
  }

  return {
    employer,
    credentials,
  };
}

/*
|--------------------------------------------------------------------------
| Seed company
|--------------------------------------------------------------------------
*/

async function seedCompany(
  companyData,
  employer
) {
  let company = await Company.findOne({
    name: companyData.name,
  });

  const companyDataToSave =
    buildCompanyData(
      companyData,
      employer._id
    );

  if (!company) {
    company = await Company.create(
      companyDataToSave
    );

    console.log(
      `Company created: ${companyData.name}`
    );
  } else {
    Object.assign(
      company,
      companyDataToSave
    );

    await company.save();

    console.log(
      `Company updated: ${companyData.name}`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Link employer to company
  |--------------------------------------------------------------------------
  */

  if (hasSchemaPath(User, "company")) {
    employer.company = company._id;
  }

  if (hasSchemaPath(User, "companyId")) {
    employer.companyId = company._id;
  }

  await employer.save();

  return company;
}

/*
|--------------------------------------------------------------------------
| Seed company jobs
|--------------------------------------------------------------------------
*/

async function seedCompanyJobs({
  companyData,
  companyDocument,
  employer,
  companyIndex,
}) {
  const companyField =
    getJobCompanyField();

  const templates =
    INDUSTRY_JOB_TEMPLATES[
      companyData.industry
    ] || DEFAULT_JOB_TEMPLATES;

  const selectedTemplates =
    templates.slice(
      0,
      JOBS_PER_COMPANY
    );

  const jobs = [];

  for (
    let jobIndex = 0;
    jobIndex < selectedTemplates.length;
    jobIndex += 1
  ) {
    const template =
      selectedTemplates[jobIndex];

    const jobData = buildJobData({
      company: companyData,
      companyId: companyDocument._id,
      employerId: employer._id,
      template,
      companyIndex,
      jobIndex,
    });

    const jobFilter = {
      title: template.title,
      [companyField]:
        companyDocument._id,
    };

    /*
    |--------------------------------------------------------------------------
    | returnDocument replaces deprecated new: true
    |--------------------------------------------------------------------------
    */

    const job =
      await Job.findOneAndUpdate(
        jobFilter,
        {
          $set: jobData,
        },
        {
          returnDocument: "after",
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    jobs.push(job);

    console.log(
      `  Job seeded: ${template.title}`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Store job references on Company when supported
  |--------------------------------------------------------------------------
  */

  if (hasSchemaPath(Company, "jobs")) {
    companyDocument.jobs = jobs.map(
      (job) => job._id
    );

    await companyDocument.save();
  }

  /*
  |--------------------------------------------------------------------------
  | Optional openings field
  |--------------------------------------------------------------------------
  */

  if (
    hasSchemaPath(
      Company,
      "openings"
    )
  ) {
    companyDocument.openings =
      jobs.length;

    await companyDocument.save();
  }

  return jobs;
}

/*
|--------------------------------------------------------------------------
| Main seed function
|--------------------------------------------------------------------------
*/

async function seedAllData() {
  const credentialsSummary = [];
  let totalJobs = 0;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from the .env file."
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "\nMongoDB connected"
    );

    /*
    |--------------------------------------------------------------------------
    | Show actual Job enums
    |--------------------------------------------------------------------------
    */

    console.log(
      "\nDetected Job schema enums:"
    );

    [
      "type",
      "status",
      "jobType",
      "employmentType",
      "experienceLevel",
      "experience",
    ].forEach((field) => {
      if (hasSchemaPath(Job, field)) {
        console.log(
          `${field}:`,
          getSchemaEnumValues(
            Job,
            field
          )
        );
      }
    });

    console.log(
      `\nStarting seed for ${COMPANIES.length} companies...\n`
    );

    for (
      let companyIndex = 0;
      companyIndex < COMPANIES.length;
      companyIndex += 1
    ) {
      const companyData =
        COMPANIES[companyIndex];

      console.log(
        `\n[${companyIndex + 1}/${COMPANIES.length}] ${companyData.name}`
      );

      const {
        employer,
        credentials,
      } = await seedEmployer(
        companyData,
        companyIndex
      );

      const companyDocument =
        await seedCompany(
          companyData,
          employer
        );

      const jobs =
        await seedCompanyJobs({
          companyData,
          companyDocument,
          employer,
          companyIndex,
        });

      totalJobs += jobs.length;

      credentialsSummary.push({
        company:
          companyData.name,
        employerId:
          employer._id.toString(),
        companyId:
          companyDocument._id.toString(),
        email:
          credentials.email,
        password:
          credentials.password,
        jobs:
          jobs.length,
      });
    }

    console.log(
      "\n============================================================"
    );

    console.log(
      "SEED COMPLETED SUCCESSFULLY"
    );

    console.log(
      "============================================================"
    );

    console.log({
      employers:
        credentialsSummary.length,
      companies:
        COMPANIES.length,
      jobs:
        totalJobs,
    });

    console.log(
      "\nEmployer login credentials:\n"
    );

    console.table(
      credentialsSummary.map(
        ({
          company,
          email,
          password,
          jobs,
        }) => ({
          company,
          email,
          password,
          jobs,
        })
      )
    );

    console.log(
      "\nThese credentials should only be used for development/testing."
    );
  } catch (error) {
    console.error(
      "\nSeed error:",
      error
    );

    if (
      error?.errors &&
      typeof error.errors ===
        "object"
    ) {
      console.error(
        "\nValidation errors:"
      );

      Object.entries(
        error.errors
      ).forEach(
        ([field, validationError]) => {
          console.error(
            `- ${field}: ${validationError.message}`
          );
        }
      );
    }

    process.exitCode = 1;
  } finally {
    if (
      mongoose.connection
        .readyState !== 0
    ) {
      await mongoose.connection.close();
    }

    console.log(
      "\nMongoDB connection closed"
    );
  }
}

seedAllData();