const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      unique: true,
      sparse: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    accountType: {
      type: String,
      required: true,
      enum: [
        "user",
        "employer",
        "admin",
        "superadmin",
      ],
      default: "user",
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    street: {
      type: String,
      trim: true,
      default: "",
    },

    houseNo: {
      type: String,
      trim: true,
      default: "",
    },

    postalCode: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    phoneNo: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      trim: true,
      default: "",
    },

    cv: {
      template: {
        type: String,
        default: "modern",
      },

      data: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      cvPdfUrl: {
  type: String,
  default: "",
},

cvPdfFilename: {
  type: String,
  default: "",
},

cvUpdatedAt: {
  type: Date,
  default: null,
},
    },

    termsAndCondition: {
      type: Boolean,
      required: true,
      validate: {
        validator(value) {
          return value === true;
        },

        message:
          "You must accept the terms and conditions.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);