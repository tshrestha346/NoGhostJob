require("dotenv").config();
const mongoose = require("mongoose");

const Job = require("../models/Job");
const Company = require("../models/Company");
const Category = require("../models/Category");
const Testimonial = require("../models/Testimonial");

const connectDB = require("../config/db");

const jobs = [
  {
    title: "Senior React Developer",
    company: "Google",
    loc: "San Francisco",
    type: "Full Time",
    sal: "$130k–$160k",
    logo: "G",
    lc: "#4285F4",
    category: "Development",
    description: "Build scalable frontend applications using React."
  },
  {
    title: "Product Designer",
    company: "LinkedIn",
    loc: "Remote",
    type: "Remote",
    sal: "$95k–$120k",
    logo: "in",
    lc: "#0077B5",
    category: "Design",
    description: "Design modern user experiences for web products."
  },
  {
    title: "AI / ML Engineer",
    company: "OpenAI",
    loc: "San Francisco",
    type: "Full Time",
    sal: "$155k–$185k",
    logo: "AI",
    lc: "#10a37f",
    category: "AI / ML",
    description: "Work on machine learning models and AI systems."
  },
  {
    title: "Cybersecurity Analyst",
    company: "Microsoft",
    loc: "London",
    type: "Hybrid",
    sal: "$100k–$130k",
    logo: "Ms",
    lc: "#00A4EF",
    category: "Cybersecurity",
    description: "Monitor, detect, and respond to security threats."
  }
];

const companies = [
  { name: "Google", initials: "G", color: "#4285F4", rating: 4.9, openings: 234 },
  { name: "Microsoft", initials: "Ms", color: "#00A4EF", rating: 4.8, openings: 189 },
  { name: "Amazon", initials: "A", color: "#FF9900", rating: 4.7, openings: 456 },
  { name: "Apple", initials: "🍎", color: "#555", rating: 4.9, openings: 167 },
  { name: "Meta", initials: "M", color: "#0866FF", rating: 4.6, openings: 234 },
  { name: "Netflix", initials: "N", color: "#E50914", rating: 4.8, openings: 98 }
];

const categories = [
  { name: "Development", icon: "⌨️", jobs: 1245 },
  { name: "Design", icon: "🎨", jobs: 892 },
  { name: "Marketing", icon: "📣", jobs: 654 },
  { name: "AI / ML", icon: "🤖", jobs: 432 },
  { name: "Cybersecurity", icon: "🔒", jobs: 321 },
  { name: "Finance", icon: "💰", jobs: 567 }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Developer at Google",
    initials: "SJ",
    color: "#1565C0",
    rating: 5,
    text: "CareerHub helped me land my dream role at Google."
  },
  {
    name: "Michael Chen",
    role: "Product Manager at Amazon",
    initials: "MC",
    color: "#FF9900",
    rating: 5,
    text: "Best job portal I've ever used."
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer at Microsoft",
    initials: "ER",
    color: "#00A4EF",
    rating: 5,
    text: "The AI job matching is genuinely impressive."
  }
];

const importData = async () => {
  try {
    await connectDB();

    await Job.deleteMany();
    await Company.deleteMany();
    await Category.deleteMany();
    await Testimonial.deleteMany();

    await Job.insertMany(jobs);
    await Company.insertMany(companies);
    await Category.insertMany(categories);
    await Testimonial.insertMany(testimonials);

    console.log("Static data inserted successfully");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

importData();