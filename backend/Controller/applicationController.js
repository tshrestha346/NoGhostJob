const mongoose = require("mongoose");

const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/user");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getAuthenticatedUserId(req) {
  return req.user?._id || req.user?.id || null;
}

function toPlainObject(value) {
  if (!value) {
    return {};
  }

  if (typeof value.toObject === "function") {
    return value.toObject();
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return {};
  }
}

function getCvSnapshot(user) {
  const cv =
    user?.cv ||
    user?.cvData ||
    user?.resume ||
    user?.resumeData ||
    {};

  if (typeof cv === "string") {
    return {
      template: cv,
    };
  }

  return toPlainObject(cv);
}

function hasMeaningfulCvData(cv) {
  if (!cv) {
    return false;
  }

  if (typeof cv === "string") {
    return cv.trim().length > 0;
  }

  const plainCv = toPlainObject(cv);

  if (
    !plainCv ||
    typeof plainCv !== "object" ||
    Array.isArray(plainCv)
  ) {
    return false;
  }

  const cvData =
    plainCv.data &&
    typeof plainCv.data === "object"
      ? plainCv.data
      : plainCv;

  const personal =
    cvData.personal &&
    typeof cvData.personal === "object"
      ? cvData.personal
      : {};

  const hasPersonalData = Object.values(personal).some(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  );

  const hasSummary =
    typeof cvData.summary === "string" &&
    cvData.summary.trim().length > 0;

  const hasSkills =
    Array.isArray(cvData.skills) &&
    cvData.skills.some(
      (skill) =>
        typeof skill === "string" &&
        skill.trim().length > 0
    );

  const hasExperience =
    Array.isArray(cvData.experience) &&
    cvData.experience.some(
      (item) =>
        item &&
        typeof item === "object" &&
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.trim().length > 0
        )
    );

  const hasEducation =
    Array.isArray(cvData.education) &&
    cvData.education.some(
      (item) =>
        item &&
        typeof item === "object" &&
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.trim().length > 0
        )
    );

  const hasProjects =
    Array.isArray(cvData.projects) &&
    cvData.projects.some(
      (item) =>
        item &&
        typeof item === "object" &&
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.trim().length > 0
        )
    );

  const hasCertifications =
    Array.isArray(cvData.certifications) &&
    cvData.certifications.some(
      (item) =>
        item &&
        typeof item === "object" &&
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.trim().length > 0
        )
    );

  const hasLanguages =
    Array.isArray(cvData.languages) &&
    cvData.languages.some(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        item.name.trim().length > 0
    );

  return Boolean(
    hasPersonalData ||
      hasSummary ||
      hasSkills ||
      hasExperience ||
      hasEducation ||
      hasProjects ||
      hasCertifications ||
      hasLanguages
  );
}

function createAbsoluteFileUrl(req, relativeUrl) {
  if (!relativeUrl) {
    return "";
  }

  if (
    relativeUrl.startsWith("http://") ||
    relativeUrl.startsWith("https://")
  ) {
    return relativeUrl;
  }

  const normalisedUrl = relativeUrl.startsWith("/")
    ? relativeUrl
    : `/${relativeUrl}`;

  const baseUrl =
    `${req.protocol}://${req.get("host")}`;

  return `${baseUrl}${normalisedUrl}`;
}

/*
|--------------------------------------------------------------------------
| Apply for a job
|--------------------------------------------------------------------------
| POST /api/applications/:jobId/apply
|--------------------------------------------------------------------------
*/

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const userId =
      getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "Authenticated user was not found.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        jobId
      )
    ) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Load applicant
    |--------------------------------------------------------------------------
    */

    const applicant =
      await User.findById(userId);

    if (!applicant) {
      return res.status(404).json({
        message:
          "Applicant account was not found.",
      });
    }

    if (
      applicant.accountType !== "user"
    ) {
      return res.status(403).json({
        message:
          "Only job-seeker accounts can apply for jobs.",
      });
    }

    if (applicant.isActive === false) {
      return res.status(403).json({
        message:
          "Your account is inactive.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check CV data or CV PDF
    |--------------------------------------------------------------------------
    */

    const cvSnapshot =
      getCvSnapshot(applicant);
      console.log("cvvvv",getCvSnapshot(applicant))

    const hasCvData =
      hasMeaningfulCvData(cvSnapshot);
  console.log("bsaihdb",hasCvData)
    const hasCvPdf =
      typeof applicant.cvPdfUrl ===
        "string" &&
      applicant.cvPdfUrl.trim() !== "";

    // console.log("CV application check:", {
    //   userId: applicant._id,
    //   hasCvData,
    //   hasCvPdf,
    //   cvPdfUrl:
    //     applicant.cvPdfUrl || "",
    //   cvKeys:
    //     cvSnapshot &&
    //     typeof cvSnapshot === "object"
    //       ? Object.keys(cvSnapshot)
    //       : [],
    // });

    if (!hasCvData && !hasCvPdf) {
      return res.status(400).json({
        message:
          "Please create and save your CV before applying.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Load job and company
    |--------------------------------------------------------------------------
    */

    const job =
      await Job.findById(jobId).populate(
        "company",
        "_id name initials logo industry location"
      );

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    if (
      job.status &&
      job.status !== "Active"
    ) {
      return res.status(400).json({
        message:
          "This job is no longer accepting applications.",
      });
    }

    if (job.isActive === false) {
      return res.status(400).json({
        message:
          "This job is no longer active.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate applications
    |--------------------------------------------------------------------------
    */

    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicant: userId,
      });

    if (existingApplication) {
      return res.status(409).json({
        message:
          "You have already applied for this job.",
        application:
          existingApplication,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare snapshots
    |--------------------------------------------------------------------------
    */

    const companyId =
      job.company?._id ||
      job.company ||
      null;

    if (!companyId) {
      return res.status(400).json({
        message:
          "This job does not have a valid company.",
      });
    }

    const cvPdfUrl =
      hasCvPdf
        ? createAbsoluteFileUrl(
            req,
            applicant.cvPdfUrl
          )
        : "";

    const coverLetter =
      typeof req.body?.coverLetter ===
      "string"
        ? req.body.coverLetter.trim()
        : "";

    /*
    |--------------------------------------------------------------------------
    | Create application
    |--------------------------------------------------------------------------
    */

    const application =
      await Application.create({
        applicant: applicant._id,
        job: job._id,
        status: "Submitted",
        coverLetter,

        applicantSnapshot: {
          fullName:
            applicant.fullName ||
            applicant.name ||
            "",

          email:
            applicant.email || "",

          phoneNo:
            applicant.phoneNo ||
            applicant.phone ||
            "",

          cv:
            cvSnapshot || {},

          cvPdfUrl,

          cvPdfFilename:
            applicant.cvPdfFilename ||
            "",
        },

        jobSnapshot: {
          title:
            job.title || "",

          company:
            companyId,

          companyName:
            job.company?.name ||
            job.companyName ||
            "",

          location:
            job.loc ||
            job.location ||
            "",

          type:
            job.type ||
            job.jobType ||
            "",

          salary:
            job.sal ||
            job.salary ||
            job.salaryRange ||
            "",
        },

        appliedAt: new Date(),
      });

    /*
    |--------------------------------------------------------------------------
    | Return populated application
    |--------------------------------------------------------------------------
    */

    const populatedApplication =
      await Application.findById(
        application._id
      )
        .populate(
          "applicant",
          "_id fullName name email phoneNo accountType role cv cvPdfUrl cvPdfFilename"
        )
        .populate({
          path: "job",
          select:
            "title company loc location type jobType sal salary logo category description status isActive",
          populate: {
            path: "company",
            select:
              "_id name initials logo industry location",
          },
        });

    return res.status(201).json({
      message:
        hasCvPdf
          ? "Application submitted successfully with your CV PDF."
          : "Application submitted successfully with your saved CV data.",

      application:
        populatedApplication,
    });
  } catch (error) {
    console.error(
      "Apply for job error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already applied for this job.",
      });
    }

    if (
      error.name ===
      "ValidationError"
    ) {
      const errors =
        Object.values(
          error.errors
        ).map(
          (validationError) =>
            validationError.message
        );

      return res.status(400).json({
        message:
          "Application validation failed.",
        errors,
      });
    }

    return res.status(500).json({
      message:
        "Failed to submit application.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get application status for current user
|--------------------------------------------------------------------------
| GET /api/applications/:jobId/status
|--------------------------------------------------------------------------
*/

exports.getApplicationStatus =
  async (req, res) => {
    try {
      const { jobId } = req.params;

      const userId =
        getAuthenticatedUserId(req);

      if (!userId) {
        return res.status(401).json({
          message:
            "Authenticated user was not found.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          jobId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid job ID.",
        });
      }

      const application =
        await Application.findOne({
          job: jobId,
          applicant: userId,
        });

      return res.status(200).json({
        applied:
          Boolean(application),

        application,
      });
    } catch (error) {
      console.error(
        "Get application status error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to check application status.",
        error: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| Get current user's applications
|--------------------------------------------------------------------------
| GET /api/applications/my-applications
|--------------------------------------------------------------------------
*/

exports.getMyApplications =
  async (req, res) => {
    try {
      const userId =
        getAuthenticatedUserId(req);

      if (!userId) {
        return res.status(401).json({
          message:
            "Authenticated user was not found.",
        });
      }

      const applications =
        await Application.find({
          applicant: userId,
        })
          .populate({
            path: "job",
            select:
              "title company loc location type jobType sal salary logo category description status isActive",
            populate: {
              path: "company",
              select:
                "_id name initials logo industry location",
            },
          })
          .sort({
            createdAt: -1,
          });

      return res
        .status(200)
        .json(applications);
    } catch (error) {
      console.error(
        "Get applications error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load your applications.",
        error: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| Get applications for one job
|--------------------------------------------------------------------------
| GET /api/applications/job/:jobId
|--------------------------------------------------------------------------
*/

exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({
      job: jobId,
    })
      .populate(
        "applicant",
        "_id fullName email phoneNo address role cv"
      )
      .populate(
        "job",
        "_id title company location"
      )
      .sort({
        createdAt: -1,
      });

    const normalizedApplications = applications.map(
      (application) => {
        const applicant =
          application.applicant || {};

        const snapshot =
          application.applicantSnapshot || {};

        const snapshotCv =
          snapshot.cv || null;

        const currentCv =
          applicant.cv || null;

        /*
        |--------------------------------------------------------------------------
        | Use snapshot CV only when it contains actual data
        |--------------------------------------------------------------------------
        */

        const snapshotHasData =
          snapshotCv &&
          snapshotCv.data &&
          typeof snapshotCv.data === "object" &&
          Object.keys(snapshotCv.data).length > 0;

        const currentHasData =
          currentCv &&
          currentCv.data &&
          typeof currentCv.data === "object" &&
          Object.keys(currentCv.data).length > 0;

        const selectedCv =
          snapshotHasData
            ? snapshotCv
            : currentHasData
            ? currentCv
            : null;

        return {
          _id: application._id,

          applicationId:
            application._id,

          job:
            application.job,

          status:
            application.status,

          createdAt:
            application.createdAt,

          applicant: {
            _id:
              applicant._id ||
              snapshot.userId ||
              null,

            fullName:
              applicant.fullName ||
              snapshot.fullName ||
              "",

            email:
              applicant.email ||
              snapshot.email ||
              "",

            phoneNo:
              applicant.phoneNo ||
              snapshot.phoneNo ||
              "",

            address:
              applicant.address ||
              snapshot.address ||
              "",

            role:
              applicant.role ||
              snapshot.role ||
              "",

            /*
            |--------------------------------------------------------------------------
            | Return CV data directly
            |--------------------------------------------------------------------------
            */

            cv:
              selectedCv,
          },
        };
      }
    );

    return res.status(200).json({
      applications:
        normalizedApplications,
    });
  } catch (error) {
    console.error(
      "Get applications for job error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to load applications",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update application status
|--------------------------------------------------------------------------
| PATCH /api/applications/:applicationId/status
|--------------------------------------------------------------------------
*/

exports.updateApplicationStatus =
  async (req, res) => {
    try {
      const {
        applicationId,
      } = req.params;

      const { status, rejectionReason } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          applicationId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid application ID.",
        });
      }

      const allowedStatuses = [
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Hired",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid application status.",
          allowedStatuses,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Require a reason when rejecting
      |--------------------------------------------------------------------------
      */

      if (
        status === "Rejected" &&
        (!rejectionReason ||
          !rejectionReason.trim())
      ) {
        return res.status(400).json({
          message:
            "A rejection reason is required.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Build the fields to update
      |--------------------------------------------------------------------------
      | Save the reason only when rejecting, and clear any stale reason
      | if the status is later changed away from "Rejected".
      |--------------------------------------------------------------------------
      */

      const updateFields = {
        status,

        rejectionReason:
          status === "Rejected"
            ? rejectionReason.trim()
            : "",
      };

      const application =
        await Application.findByIdAndUpdate(
          applicationId,
          {
            $set: updateFields,
          },
          {
            new: true,
            runValidators: true,
          }
        )
          .populate(
            "applicant",
            "_id fullName name email phoneNo accountType role cv cvPdfUrl cvPdfFilename"
          )
          .populate({
            path: "job",
            select:
              "title company loc location type jobType sal salary status",
            populate: {
              path: "company",
              select:
                "_id name initials logo industry location",
            },
          });

      if (!application) {
        return res.status(404).json({
          message:
            "Application not found.",
        });
      }

      return res.status(200).json({
        message:
          "Application status updated successfully.",

        application,
      });
    } catch (error) {
      console.error(
        "Update application status error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update application status.",
        error: error.message,
      });
    }
  };
