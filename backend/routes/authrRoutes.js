const express = require("express");

const router = express.Router();


const {
  registerUser,
  loginUser,
  updateUserProfile,
  saveUserCv,
  getUserCV,
  getUserProfile,
} = require("../Controller/authControllers");

const {
  createContactMessage,
} = require("../Controller/contactController");


const validateContact = require(
  "../middleware/validateContact"
);

const protect = require(
  "../middleware/authMiddleware"
);


router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);


router.get(
  "/profile",
  protect,
  getUserProfile
);

router.put(
  "/profile",
  protect,
  updateUserProfile
);


router.post(
  "/contact",
  validateContact,
  createContactMessage
);


router.post(
  "/cv",
  protect,
  saveUserCv
);

router.get(
  "/cv",
  protect,
  getUserCV
);

module.exports = router;