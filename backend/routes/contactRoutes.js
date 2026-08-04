const express = require("express");
const router = express.Router();

const { getContactMessage } = require("../Controller/contactController");

router.get("/", getContactMessage);

module.exports = router;