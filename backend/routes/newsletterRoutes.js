const express = require("express");
const { subscribe } = require("../Controller/newsletterController");

const router = express.Router();

router.post("/", subscribe);

module.exports = router;