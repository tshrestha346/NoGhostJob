const express = require("express");
const { subscribe } = require("../controller/newsletterController");

const router = express.Router();

router.post("/", subscribe);

module.exports = router;