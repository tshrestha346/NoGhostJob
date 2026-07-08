const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
      enum: ["user", "employer", "admin", "superadmin"],
      default: "user",
    },

    address: {
      type: String,
      trim: true,
    },

    street: {
      type: String,
      trim: true,
    },

    houseNo: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    phoneNo: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    cv: {
  template: {
    type: String,
    default: "modern",
  },
  data: {
    type: Object,
    default: {},
  },
},
    termsAndCondition: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (value) {
          return value === true;
        },
        message: "You must accept the terms and conditions.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);