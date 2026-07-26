const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const applicationRoutes = require("./routes/applicationRoutes");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authrRoutes"));
app.use("/api/", require("./routes/authrRoutes")); // Contact route
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/applications",require("./routes/applicationRoutes"));
app.use("/api/applications", applicationRoutes);
// Protected test route
const protect = require("./middleware/authMiddleware");

app.get("/api/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome to protected dashboard",
    user: req.user,
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);