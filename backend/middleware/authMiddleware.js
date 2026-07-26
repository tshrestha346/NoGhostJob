const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  try {
    const authorizationHeader =
      req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token =
      authorizationHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId =
      decoded.id ||
      decoded._id ||
      decoded.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "Token does not contain a user ID",
      });
    }

    const user = await User.findById(
      userId
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message:
          "User associated with token was not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error
    );

    if (
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message:
          "Your session has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      message:
        "Not authorized, token failed",
    });
  }
};

module.exports = protect;