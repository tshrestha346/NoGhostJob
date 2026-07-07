const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    story_title: String,
    story_description: String,
    years_of_excellence: Number,
    enterprise_client: Number,
    client_retnetion: Number,
    countries_served: Number,
    mission_title: String,
    mission_description: String,
    vision_title: String,
    vision_description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);