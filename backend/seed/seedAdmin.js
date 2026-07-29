require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
    try {
        await connectDB();

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await User.create({
            fullName: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            isActive: true,
            isAdmin: true,
            accountType: "admin",
            termsAndCondition: true
        });

        console.log("Admin seeded successfully.");

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();