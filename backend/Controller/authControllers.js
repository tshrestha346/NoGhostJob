const fs = require("fs");
const path = require("path");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  generateCvPdf,
} = require("../utils/cvPdfGenerator");
/*
|--------------------------------------------------------------------------
| Generate JWT token
|--------------------------------------------------------------------------
*/

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing from the environment variables"
    );
  }

  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/*
|--------------------------------------------------------------------------
| Create standard user response
|--------------------------------------------------------------------------
*/

const createUserResponse = (
  user,
  token = null
) => {
  const companyId =
    user.company?._id?.toString?.() ||
    user.company?.toString?.() ||
    null;

  const response = {
    _id: user._id.toString(),
    fullName: user.fullName || "",
    email: user.email || "",
    phoneNo: user.phoneNo || "",
    address: user.address || "",
    street: user.street || "",
    houseNo: user.houseNo || "",
    postalCode: user.postalCode || "",
    country: user.country || "",
    role: user.role || "",

    company: user.company || null,
    companyId,

    isActive: user.isActive,
    isAdmin: user.isAdmin,
    accountType: user.accountType,
  };

  if (token) {
    response.token = token;
  }

  return response;
};

/*
|--------------------------------------------------------------------------
| Register user
|--------------------------------------------------------------------------
*/

exports.registerUser = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      password,
      termsAndCondition,
      accountType,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message:
          "Full name, email and password are required",
      });
    }

    if (termsAndCondition !== true) {
      return res.status(400).json({
        message:
          "You must accept the terms and conditions",
      });
    }

    const normalisedEmail = email
      .trim()
      .toLowerCase();

    const userExists = await User.findOne({
      email: normalisedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const allowedAccountTypes = [
      "user",
      "employer",
    ];

    const selectedAccountType =
      allowedAccountTypes.includes(accountType)
        ? accountType
        : "user";

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalisedEmail,
      password: hashedPassword,
      termsAndCondition: true,
      accountType: selectedAccountType,
    });

    const token = generateToken(
      user._id
    );

    return res.status(201).json(
      createUserResponse(user, token)
    );
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "A user with this email already exists",
      });
    }

    return res.status(500).json({
      message:
        error.message ||
        "Unable to register user",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Login user
|--------------------------------------------------------------------------
*/

exports.loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const normalisedEmail =
      String(email)
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email:
          normalisedEmail,
      }).populate(
        "company",
        "_id name initials industry size location website logo description"
      );

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          "Your account is inactive",
      });
    }

    const receivedPassword =
      String(password).trim();

    let isMatch =
      await bcrypt.compare(
        receivedPassword,
        user.password
      );

    /*
    |--------------------------------------------------------------------------
    | Temporary development bypass
    |--------------------------------------------------------------------------
    */

    const allowDevBypass =
      process.env.NODE_ENV ===
        "development" &&
      process.env
        .ALLOW_DEV_LOGIN_BYPASS ===
        "true" &&
      normalisedEmail ===
        "employer@gmail.com";

    if (allowDevBypass) {
      console.warn(
        "Development login bypass used for:",
        normalisedEmail
      );

      isMatch = true;
    }

    console.log({
      enteredEmail:
        normalisedEmail,

      userId:
        user._id.toString(),

      userFound: true,

      passwordLength:
        receivedPassword.length,

      storedPasswordExists:
        Boolean(user.password),

      passwordMatches:
        isMatch,

      devBypassUsed:
        allowDevBypass,

      company:
        user.company,
    });

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    const token =
      generateToken(user._id);

    const companyId =
      user.company?._id?.toString() ||
      user.company?.toString() ||
      null;

    return res.status(200).json({
      _id:
        user._id.toString(),

      fullName:
        user.fullName,

      email:
        user.email,

      phoneNo:
        user.phoneNo || "",

      address:
        user.address || "",

      street:
        user.street || "",

      houseNo:
        user.houseNo || "",

      postalCode:
        user.postalCode || "",

      country:
        user.country || "",

      role:
        user.role || "",

      accountType:
        user.accountType,

      isActive:
        user.isActive,

      isAdmin:
        user.isAdmin,

      company:
        user.company || null,

      companyId,

      token,
    });
  } catch (error) {
    console.error(
      "Login user error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to log in",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get current user's profile
|--------------------------------------------------------------------------
*/

exports.getUserProfile = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message:
          "User not authorised",
      });
    }

    const user = await User.findById(
      req.user._id
    )
      .select("-password -__v")
      .populate(
        "company",
        "_id name initials industry location size website description logo"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(
      createUserResponse(user)
    );
  } catch (error) {
    console.error(
      "Get profile error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to load profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update current user's profile
|--------------------------------------------------------------------------
*/

exports.updateUserProfile = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message:
          "User not authorised",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const allowedFields = [
      "fullName",
      "phoneNo",
      "address",
      "street",
      "houseNo",
      "postalCode",
      "country",
      "role",
    ];

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        user[field] =
          typeof req.body[field] ===
          "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    await user.save();

    const updatedUser =
      await User.findById(
        user._id
      )
        .select("-password -__v")
        .populate(
          "company",
          "_id name initials industry location size website description logo"
        );

    const authorizationHeader =
      req.headers.authorization || "";

    const currentToken =
      authorizationHeader.startsWith(
        "Bearer "
      )
        ? authorizationHeader.substring(
            7
          )
        : generateToken(
            updatedUser._id
          );

    return res.status(200).json(
      createUserResponse(
        updatedUser,
        currentToken
      )
    );
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to update profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Save or replace current user's CV
|--------------------------------------------------------------------------
*/

async function removeOldCvPdf(
  oldUrl
) {
  if (
    !oldUrl ||
    !oldUrl.startsWith(
      "/uploads/cvs/"
    )
  ) {
    return;
  }

  const filename =
    path.basename(oldUrl);

  const absolutePath =
    path.join(
      __dirname,
      "..",
      "uploads",
      "cvs",
      filename
    );

  try {
    await fs.promises.unlink(
      absolutePath
    );
  } catch (error) {
    if (
      error.code !== "ENOENT"
    ) {
      console.error(
        "Failed to delete old CV PDF:",
        error
      );
    }
  }
}

/*
|--------------------------------------------------------------------------
| POST /api/auth/cv
|--------------------------------------------------------------------------
*/

exports.saveUserCv = async (req, res) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authenticated user was not found.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User was not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Extract only the CV template and data
    |--------------------------------------------------------------------------
    */

    const cvData = {
      template:
        req.body?.template ||
        req.body?.cv?.template ||
        "modern",

      data:
        req.body?.data ||
        req.body?.cv?.data ||
        {},
    };

    if (
      !cvData.data ||
      typeof cvData.data !== "object" ||
      Array.isArray(cvData.data)
    ) {
      return res.status(400).json({
        message: "Valid CV data is required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Save CV content first
    |--------------------------------------------------------------------------
    */

    user.cv = cvData;
    user.cvUpdatedAt = new Date();

    await user.save();

    /*
    |--------------------------------------------------------------------------
    | Generate PDF
    |--------------------------------------------------------------------------
    */

    let generatedPdf = null;

    try {
      generatedPdf = await generateCvPdf({
        cv: cvData,
        user,
      });

      /*
      |--------------------------------------------------------------------------
      | Save PDF details at the USER TOP LEVEL
      |--------------------------------------------------------------------------
      */

      user.cvPdfUrl =
        generatedPdf.relativeUrl;

      user.cvPdfFilename =
        generatedPdf.filename;

      user.cvUpdatedAt =
        new Date();

      await user.save();
    } catch (pdfError) {
      console.error(
        "PDF generation failed:",
        pdfError
      );

      return res.status(200).json({
        message:
          "CV data was saved, but the PDF could not be generated.",

        cv: user.cv,

        cvPdfUrl:
          user.cvPdfUrl || "",

        cvPdfFilename:
          user.cvPdfFilename || "",

        cvUpdatedAt:
          user.cvUpdatedAt,

        pdfGenerated: false,

        pdfError:
          pdfError.message,
      });
    }

    const baseUrl =
      `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      message:
        "CV and PDF saved successfully.",

      cv:
        user.cv,

      cvPdfUrl:
        user.cvPdfUrl
          ? `${baseUrl}${user.cvPdfUrl}`
          : "",

      cvPdfFilename:
        user.cvPdfFilename || "",

      cvUpdatedAt:
        user.cvUpdatedAt,

      pdfGenerated:
        Boolean(generatedPdf),
    });
  } catch (error) {
    console.error(
      "Save CV error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to save CV and generate PDF.",

      error:
        error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get current user's CV
|--------------------------------------------------------------------------
*/

exports.getUserCV = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        message:
          "User not authorised",
      });
    }

    const user = await User.findById(
      req.user._id
    ).select("cv");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      cv: user.cv || null,
    });
  } catch (error) {
    console.error(
      "Get CV error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to load CV",
    });
  }
};