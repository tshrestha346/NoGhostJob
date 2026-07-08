const express = require("express");
const router = express.Router();
const { registerUser, loginUser,updateUserProfile, saveUserCV, getUserCV } = require("../Controller/authControllers");
const { createContactMessage } = require("../Controller/contactController");
const validateContact = require("../middleware/validateContact");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile",protect, updateUserProfile);
router.post("/contact", validateContact, createContactMessage);
router.post("/cv", protect, saveUserCV);
router.get("/cv", protect, getUserCV);
module.exports = router;