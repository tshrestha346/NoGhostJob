require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");

const EMAIL = "employer@gmail.com";
const NEW_PASSWORD = "Employer@123";

async function resetEmployerPassword() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from the .env file"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");
    console.log(
      "Database:",
      mongoose.connection.name
    );

    const normalisedEmail = EMAIL
      .trim()
      .toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalisedEmail,
      });

    if (!existingUser) {
      throw new Error(
        `No user found with email ${normalisedEmail}`
      );
    }

    console.log(
      "Employer found:",
      existingUser._id.toString()
    );

    const passwordHash =
      await bcrypt.hash(
        NEW_PASSWORD,
        10
      );


    const updateResult =
      await User.updateOne(
        {
          _id: existingUser._id,
        },
        {
          $set: {
            password: passwordHash,
            accountType: "employer",
            isActive: true,
            isAdmin: false,
            termsAndCondition: true,
          },
        }
      );

    console.log(
      "Update result:",
      updateResult
    );


    const updatedUser =
      await User.findOne({
        email: normalisedEmail,
      }).select("+password");

    if (!updatedUser) {
      throw new Error(
        "User disappeared after password update"
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        NEW_PASSWORD,
        updatedUser.password
      );

    console.log({
      employerId:
        updatedUser._id.toString(),

      email:
        updatedUser.email,

      database:
        mongoose.connection.name,

      hashPrefix:
        updatedUser.password.substring(
          0,
          7
        ),

      passwordMatches,
    });

    if (!passwordMatches) {
      throw new Error(
        "Password was updated but verification failed"
      );
    }

    console.log(
      "\nEmployer password reset successfully"
    );

    console.log(
      "Email:",
      EMAIL
    );

    console.log(
      "Password:",
      NEW_PASSWORD
    );
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    process.exitCode = 1;
  } finally {
    if (
      mongoose.connection.readyState !==
      0
    ) {
      await mongoose.connection.close();
    }

    console.log(
      "MongoDB connection closed"
    );
  }
}

resetEmployerPassword();