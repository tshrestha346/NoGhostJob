const mongoose = require("mongoose");
const Job = require("../models/Job");
const Company = require("../models/Company");

function normaliseRequirements(requirements) {
  if (Array.isArray(requirements)) {
    return requirements
      .map((requirement) =>
        String(requirement).trim()
      )
      .filter(Boolean);
  }

  if (typeof requirements === "string") {
    return requirements
      .split(",")
      .map((requirement) =>
        requirement.trim()
      )
      .filter(Boolean);
  }

  return [];
}

function getCompanyId(body) {
  return (
    body.companyId ||
    body.company?._id ||
    body.company ||
    null
  );
}

function getLocation(body) {
  return (
    body.loc ||
    body.location ||
    ""
  );
}

function getSalary(body) {
  return (
    body.sal ||
    body.salary ||
    ""
  );
}


exports.getJobs = async (req, res) => {
  try {
    const {
      keyword,
      loc,
      location,
      type,
      category,
      company,
      status,
      isFeatured,
    } = req.query;

    const filter = {};

    if (keyword?.trim()) {
      const searchValue =
        keyword.trim();

      filter.$or = [
        {
          title: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    const locationValue =
      loc || location;

    if (locationValue?.trim()) {
      filter.loc = {
        $regex:
          locationValue.trim(),
        $options: "i",
      };
    }

    if (type?.trim()) {
      filter.type = type.trim();
    }

    if (category?.trim()) {
      filter.category = {
        $regex: category.trim(),
        $options: "i",
      };
    }

    if (status?.trim()) {
      filter.status =
        status.trim();
    }

    if (
      typeof isFeatured !==
      "undefined"
    ) {
      filter.isFeatured =
        isFeatured === "true";
    }

    if (company) {
      if (
        !mongoose.Types.ObjectId.isValid(
          company
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid company ID.",
        });
      }

      filter.company = company;
    }

    const jobs = await Job.find(
      filter
    )
      .populate(
        "company",
        "name initials color industry location size logo website description"
      )
      .sort({
        createdAt: -1,
      });

    return res
      .status(200)
      .json(jobs);
  } catch (error) {
    console.error(
      "Get jobs error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load jobs.",
      error: error.message,
    });
  }
};


exports.getJobById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const job =
      await Job.findById(
        id
      ).populate(
        "company",
        "name initials color industry location size logo website description"
      );

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    return res
      .status(200)
      .json(job);
  } catch (error) {
    console.error(
      "Get job error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load job.",
      error: error.message,
    });
  }
};


exports.createJob = async (
  req,
  res
) => {
  try {

    const companyId =
      getCompanyId(req.body);

    const loc =
      getLocation(req.body).trim();

    const sal =
      getSalary(req.body).trim();

    const title =
      req.body.title?.trim();

    if (!title) {
      return res.status(400).json({
        message:
          "Job title is required.",
      });
    }

    if (!companyId) {
      return res.status(400).json({
        message:
          "Company ID is required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        companyId
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid company ID.",
      });
    }

    const companyExists =
      await Company.exists({
        _id: companyId,
      });

    if (!companyExists) {
      return res.status(404).json({
        message:
          "Company not found.",
      });
    }

    if (!loc) {
      return res.status(400).json({
        message:
          "Job location is required.",
      });
    }

    if (!sal) {
      return res.status(400).json({
        message:
          "Salary is required.",
      });
    }

    const allowedTypes = [
      "Full Time",
      "Remote",
      "Hybrid",
      "Part Time",
      "Internship",
    ];

    const type =
      req.body.type ||
      req.body.jobType ||
      "Full Time";

    if (
      !allowedTypes.includes(type)
    ) {
      return res.status(400).json({
        message:
          "Invalid job type.",
        allowedTypes,
      });
    }

    const allowedStatuses = [
      "Active",
      "Closed",
      "Draft",
    ];

    const status =
      req.body.status || "Active";

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Status must be Active, Closed or Draft.",
      });
    }

    const jobData = {
      title,
      company: companyId,
      loc,
      sal,
      type,

      logo:
        req.body.logo || "",

      lc:
        req.body.lc || "",

      category:
        req.body.category?.trim() ||
        "",

      description:
        req.body.description?.trim() ||
        "",

      requirements:
        normaliseRequirements(
          req.body.requirements
        ),

      isFeatured:
        typeof req.body
          .isFeatured === "boolean"
          ? req.body.isFeatured
          : true,

      status,

      isActive:
        status === "Active",
    };

    if (
      req.body.job_id !==
        undefined &&
      req.body.job_id !== null &&
      req.body.job_id !== ""
    ) {
      jobData.job_id =
        Number(req.body.job_id);
    }

    const job =
      await Job.create(jobData);

    const populatedJob =
      await Job.findById(
        job._id
      ).populate(
        "company",
        "name initials color industry location size logo website description"
      );

    return res
      .status(201)
      .json({
        message:
          "Job created successfully.",
        job: populatedJob,
      });
  } catch (error) {
    console.error(
      "Create job error:",
      error
    );

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
          "Job validation failed.",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "A job with this job ID already exists.",
      });
    }

    return res.status(500).json({
      message:
        "Failed to create job.",
      error: error.message,
    });
  }
};


exports.updateJob = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const existingJob =
      await Job.findById(id);

    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    const updateData = {};

    if (
      req.body.title !==
      undefined
    ) {
      const title =
        req.body.title?.trim();

      if (!title) {
        return res.status(400).json({
          message:
            "Job title cannot be empty.",
        });
      }

      updateData.title = title;
    }

    const companyId =
      getCompanyId(req.body);

    if (companyId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          companyId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid company ID.",
        });
      }

      const companyExists =
        await Company.exists({
          _id: companyId,
        });

      if (!companyExists) {
        return res.status(404).json({
          message:
            "Company not found.",
        });
      }

      updateData.company =
        companyId;
    }

    if (
      req.body.loc !==
        undefined ||
      req.body.location !==
        undefined
    ) {
      const loc =
        getLocation(
          req.body
        ).trim();

      if (!loc) {
        return res.status(400).json({
          message:
            "Job location cannot be empty.",
        });
      }

      updateData.loc = loc;
    }

    if (
      req.body.sal !==
        undefined ||
      req.body.salary !==
        undefined
    ) {
      const sal =
        getSalary(
          req.body
        ).trim();

      if (!sal) {
        return res.status(400).json({
          message:
            "Salary cannot be empty.",
        });
      }

      updateData.sal = sal;
    }

    if (
      req.body.type !==
        undefined ||
      req.body.jobType !==
        undefined
    ) {
      const type =
        req.body.type ||
        req.body.jobType;

      const allowedTypes = [
        "Full Time",
        "Remote",
        "Hybrid",
        "Part Time",
        "Internship",
      ];

      if (
        !allowedTypes.includes(type)
      ) {
        return res.status(400).json({
          message:
            "Invalid job type.",
          allowedTypes,
        });
      }

      updateData.type = type;
    }

    if (
      req.body.category !==
      undefined
    ) {
      updateData.category =
        req.body.category?.trim() ||
        "";
    }

    if (
      req.body.description !==
      undefined
    ) {
      updateData.description =
        req.body.description?.trim() ||
        "";
    }

    if (
      req.body.requirements !==
      undefined
    ) {
      updateData.requirements =
        normaliseRequirements(
          req.body.requirements
        );
    }

    if (
      req.body.logo !==
      undefined
    ) {
      updateData.logo =
        req.body.logo || "";
    }

    if (
      req.body.lc !== undefined
    ) {
      updateData.lc =
        req.body.lc || "";
    }

    if (
      req.body.isFeatured !==
      undefined
    ) {
      updateData.isFeatured =
        Boolean(
          req.body.isFeatured
        );
    }

    if (
      req.body.status !==
      undefined
    ) {
      const allowedStatuses = [
        "Active",
        "Closed",
        "Draft",
      ];

      if (
        !allowedStatuses.includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          message:
            "Status must be Active, Closed or Draft.",
        });
      }

      updateData.status =
        req.body.status;

      updateData.isActive =
        req.body.status ===
        "Active";
    }

    const job =
      await Job.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "company",
        "name initials color industry location size logo website description"
      );

    return res.status(200).json({
      message:
        "Job updated successfully.",
      job,
    });
  } catch (error) {
    console.error(
      "Update job error:",
      error
    );

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
          "Job validation failed.",
        errors,
      });
    }

    return res.status(500).json({
      message:
        "Failed to update job.",
      error: error.message,
    });
  }
};


exports.updateJobStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const allowedStatuses = [
      "Active",
      "Closed",
      "Draft",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Status must be Active, Closed or Draft.",
      });
    }

    const job =
      await Job.findByIdAndUpdate(
        id,
        {
          status,
          isActive:
            status === "Active",
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "company",
        "name initials color industry location size logo website description"
      );

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      message:
        "Job status updated successfully.",
      job,
    });
  } catch (error) {
    console.error(
      "Update job status error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update job status.",
      error: error.message,
    });
  }
};


exports.deleteJob = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const job =
      await Job.findByIdAndDelete(
        id
      );

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      message:
        "Job deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete job error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete job.",
      error: error.message,
    });
  }
};