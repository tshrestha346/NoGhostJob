const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../Controller/authControllers");
const { createContactMessage } = require("../Controller/contactController");
const validateContact = require("../middleware/validateContact");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/contact", validateContact, createContactMessage);

module.exports = router;