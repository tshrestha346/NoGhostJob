const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (
  req,
  res,
  next
) => {
  try {
    const authorizationHeader =
      req.headers.authorization || "";

    if (
      !authorizationHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        message:
          "Not authorised, no token provided",
      });
    }

    const token =
      authorizationHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        message:
          "Not authorised, no token provided",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing from environment variables"
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message:
          "Not authorised, user not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          "Your account is inactive",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        message:
          "Session expired. Please log in again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message:
          "Not authorised, invalid token",
      });
    }

    return res.status(401).json({
      message:
        "Not authorised, token failed",
    });
  }
};

module.exports = protect;