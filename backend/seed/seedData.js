require("dotenv").config();

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
    description:
      "Build scalable frontend applications using React.",
    requirements: [
      "Strong knowledge of React and JavaScript",
      "Experience with REST APIs",
      "Knowledge of Git and GitHub",
      "Understanding of responsive web design",
      "Experience with frontend testing",
    ],
    isFeatured: true,
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
    description:
      "Design modern user experiences for web products.",
    requirements: [
      "Experience with Figma",
      "Knowledge of UI and UX principles",
      "Ability to create wireframes and prototypes",
      "Strong communication skills",
      "Experience working with product teams",
    ],
    isFeatured: true,
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
    description:
      "Work on machine learning models and AI systems.",
    requirements: [
      "Strong knowledge of Python",
      "Experience with machine learning",
      "Understanding of neural networks",
      "Experience with TensorFlow or PyTorch",
      "Knowledge of data preprocessing",
    ],
    isFeatured: true,
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
    description:
      "Monitor, detect and respond to security threats.",
    requirements: [
      "Knowledge of network security",
      "Experience with security monitoring tools",
      "Understanding of incident response",
      "Familiarity with SIEM platforms",
      "Knowledge of vulnerability assessment",
    ],
    isFeatured: true,
  },
  {
    title: "Junior React Developer",
    company: "TechNova Berlin",
    loc: "Berlin, Germany",
    type: "Full Time",
    sal: "€42,000–€50,000 per year",
    logo: "TN",
    lc: "#1565C0",
    category: "Development",
    description:
      "Build responsive web applications and work with frontend and backend teams.",
    requirements: [
      "Basic knowledge of React and JavaScript",
      "Understanding of HTML, CSS and Tailwind CSS",
      "Familiarity with REST APIs",
      "Basic Git and GitHub knowledge",
      "Good communication skills",
    ],
    isFeatured: true,
  },
  {
    title: "Cybersecurity Intern",
    company: "SecureWave GmbH",
    loc: "Berlin, Germany",
    type: "Internship",
    sal: "€1,200 per month",
    logo: "SW",
    lc: "#7C3AED",
    category: "Cybersecurity",
    description:
      "Support the security team with vulnerability assessment, log analysis and incident documentation.",
    requirements: [
      "Currently studying cybersecurity or information technology",
      "Basic networking knowledge",
      "Understanding of common cyberattacks",
      "Familiarity with Wireshark",
      "Willingness to learn",
    ],
    isFeatured: true,
  },
  {
    title: "MERN Stack Developer",
    company: "CloudBridge Solutions",
    loc: "Remote",
    type: "Remote",
    sal: "€48,000–€60,000 per year",
    logo: "CB",
    lc: "#059669",
    category: "Development",
    description:
      "Develop and maintain applications using MongoDB, Express, React and Node.js.",
    requirements: [
      "Experience with React and Node.js",
      "Knowledge of Express and MongoDB",
      "Understanding of JWT authentication",
      "Experience working with REST APIs",
      "Ability to work independently",
    ],
    isFeatured: true,
  },
];

const companies = [
  {
    name: "Google",
    initials: "G",
    color: "#4285F4",
    rating: 4.9,
    openings: 234,
  },
  {
    name: "Microsoft",
    initials: "Ms",
    color: "#00A4EF",
    rating: 4.8,
    openings: 189,
  },
  {
    name: "Amazon",
    initials: "A",
    color: "#FF9900",
    rating: 4.7,
    openings: 456,
  },
  {
    name: "Apple",
    initials: "🍎",
    color: "#555555",
    rating: 4.9,
    openings: 167,
  },
  {
    name: "Meta",
    initials: "M",
    color: "#0866FF",
    rating: 4.6,
    openings: 234,
  },
  {
    name: "Netflix",
    initials: "N",
    color: "#E50914",
    rating: 4.8,
    openings: 98,
  },
];

const categories = [
  {
    name: "Development",
    icon: "⌨️",
    jobs: 1245,
  },
  {
    name: "Design",
    icon: "🎨",
    jobs: 892,
  },
  {
    name: "Marketing",
    icon: "📣",
    jobs: 654,
  },
  {
    name: "AI / ML",
    icon: "🤖",
    jobs: 432,
  },
  {
    name: "Cybersecurity",
    icon: "🔒",
    jobs: 321,
  },
  {
    name: "Finance",
    icon: "💰",
    jobs: 567,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Developer at Google",
    initials: "SJ",
    color: "#1565C0",
    rating: 5,
    text: "CareerHub helped me land my dream role at Google.",
  },
  {
    name: "Michael Chen",
    role: "Product Manager at Amazon",
    initials: "MC",
    color: "#FF9900",
    rating: 5,
    text: "Best job portal I've ever used.",
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer at Microsoft",
    initials: "ER",
    color: "#00A4EF",
    rating: 5,
    text: "The AI job matching is genuinely impressive.",
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Job.deleteMany({}),
      Company.deleteMany({}),
      Category.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);

    await Promise.all([
      Job.insertMany(jobs),
      Company.insertMany(companies),
      Category.insertMany(categories),
      Testimonial.insertMany(testimonials),
    ]);

    console.log("Static data inserted successfully.");
    console.log(`${jobs.length} jobs inserted.`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

importData();