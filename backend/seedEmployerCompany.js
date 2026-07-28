require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Company = require(
  "./models/Company"
);

const EMPLOYER_EMAIL =
  "employer2@gmail.com";

const EMPLOYER_PASSWORD =
  "Employer2@123";

const seedEmployerCompany =
  async () => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error(
          "MONGO_URI is missing from the .env file"
        );
      }

      await mongoose.connect(
        process.env.MONGO_URI
      );

      console.log(
        "MongoDB connected"
      );

      const normalisedEmail =
        EMPLOYER_EMAIL.trim().toLowerCase();

      /*
      |--------------------------------------------------------------------------
      | Find or create employer
      |--------------------------------------------------------------------------
      */

      let employer =
        await User.findOne({
          email: normalisedEmail,
        });

      const hashedPassword =
        await bcrypt.hash(
          EMPLOYER_PASSWORD,
          10
        );

      if (!employer) {
        employer = await User.create({
          fullName: "Employer",
          email: normalisedEmail,
          password: hashedPassword,
          accountType: "employer",
          termsAndCondition: true,
          isActive: true,
          isAdmin: false,
        });

        console.log(
          "Employer created:",
          employer._id.toString()
        );
      } else {
        console.log(
          "Employer already exists:",
          employer._id.toString()
        );

        /*
        |--------------------------------------------------------------------------
        | Reset existing employer credentials
        |--------------------------------------------------------------------------
        */

        employer.fullName =
          "Employer";

        employer.email =
          normalisedEmail;

        employer.password =
          hashedPassword;

        employer.accountType =
          "employer";

        employer.isActive = true;
        employer.isAdmin = false;

        employer.termsAndCondition =
          true;

        await employer.save();

        console.log(
          "Existing employer password reset successfully"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Find employer's existing company
      |--------------------------------------------------------------------------
      */

      let company =
        await Company.findOne({
          owner: employer._id,
        });

      /*
      |--------------------------------------------------------------------------
      | Try finding company from user's company field
      |--------------------------------------------------------------------------
      */

      if (
        !company &&
        employer.company
      ) {
        company =
          await Company.findById(
            employer.company
          );
      }

      /*
      |--------------------------------------------------------------------------
      | Create company when none exists
      |--------------------------------------------------------------------------
      */

      if (!company) {
        company =
          await Company.create({
            name:
              "NoGhostJob Company 2",

            initials: "NG2",

            industry:
              "Technology",

            location:
              "Berlin, Germany",

            size:
              "11-50 employees",

            website:
              "https://noghostjob.example",

            description:
              "A technology company focused on transparent and reliable job opportunities.",

            founded: 2026,

            owner:
              employer._id,
          });

        console.log(
          "Company created:",
          company._id.toString()
        );
      } else {
        console.log(
          "Company already exists:",
          company._id.toString()
        );

        /*
        |--------------------------------------------------------------------------
        | Ensure company is connected to this employer
        |--------------------------------------------------------------------------
        */

        if (
          !company.owner ||
          company.owner.toString() !==
            employer._id.toString()
        ) {
          company.owner =
            employer._id;

          await company.save();
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Link company to employer
      |--------------------------------------------------------------------------
      */

      employer.company =
        company._id;

      await employer.save();

      /*
      |--------------------------------------------------------------------------
      | Verify password before finishing
      |--------------------------------------------------------------------------
      */

      const passwordMatches =
        await bcrypt.compare(
          EMPLOYER_PASSWORD,
          employer.password
        );

      if (!passwordMatches) {
        throw new Error(
          "Password verification failed after saving employer"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Load final populated employer
      |--------------------------------------------------------------------------
      */

      const linkedEmployer =
        await User.findById(
          employer._id
        ).populate(
          "company",
          "_id name initials industry location size website description"
        );

      console.log(
        "\nEmployer successfully seeded and linked"
      );

      console.log({
        employerId:
          linkedEmployer._id.toString(),

        fullName:
          linkedEmployer.fullName,

        email:
          linkedEmployer.email,

        accountType:
          linkedEmployer.accountType,

        companyId:
          linkedEmployer.company?._id?.toString() ||
          null,

        company:
          linkedEmployer.company,

        passwordVerified:
          passwordMatches,
      });

      console.log(
        "\nLogin email:",
        EMPLOYER_EMAIL
      );

      console.log(
        "Login password:",
        EMPLOYER_PASSWORD
      );
    } catch (error) {
      console.error(
        "Seed error:",
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
  };

seedEmployerCompany();