const express = require("express");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

const validateContact = require(
  "../middleware/validateContact"
);

const protect = require(
  "../middleware/authMiddleware"
);

/*
|--------------------------------------------------------------------------
| Authentication routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

/*
|--------------------------------------------------------------------------
| Profile routes
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Contact route
|--------------------------------------------------------------------------
*/

router.post(
  "/contact",
  validateContact,
  createContactMessage
);

/*
|--------------------------------------------------------------------------
| CV routes
|--------------------------------------------------------------------------
*/

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