require("dotenv").config();
const mongoose = require("mongoose");
const Settings = require("../models/Settings");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const settingsData = {
  name: "No Ghost Job",
  title: "No Ghost Job",
  description: "No Ghost Job is a modern recruitment platform dedicated to connecting talented job seekers with trusted employers through a transparent and efficient hiring process. We aim to eliminate communication gaps in recruitment by providing a seamless job search experience, simplified hiring tools, and timely application updates for both candidates and employers.",
  mobile_no: "+490123456789",
  country: "Germany",
  state: "Berlin",
  city: "Charlottenburg",
  street: "Franklinstrasse",
  house_no: "28-29",
};

async function seedSettings() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI (or MONGODB_URI) is not set in your environment.");
    }

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Settings is a singleton — upsert so re-running this seeder never creates duplicates.
    const settings = await Settings.findOneAndUpdate(
      {},
      settingsData,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log("Settings seeded:", settings);
  } catch (err) {
    console.error("Failed to seed settings:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedSettings();