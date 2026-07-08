const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, termsAndCondition } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      termsAndCondition,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      accountType: user.accountType,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      accountType: user.accountType,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateUserProfile = async (req, res) => {
  try {

    console.log(req.body,"sjisoj")
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.phoneNo = req.body.phoneNo || user.phoneNo;
    user.address = req.body.address || user.address;
    user.street = req.body.street || user.street;
    user.houseNo = req.body.houseNo || user.houseNo;
    user.postalCode = req.body.postalCode || user.postalCode;
    user.country = req.body.country || user.country;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phoneNo: updatedUser.phoneNo,
      address: updatedUser.address,
      street: updatedUser.street,
      houseNo: updatedUser.houseNo,
      postalCode: updatedUser.postalCode,
      country: updatedUser.country,
      role: updatedUser.role,
      token: req.headers.authorization.split(" ")[1],
      isActive: updatedUser.isActive,
      isAdmin: updatedUser.isAdmin,
      accountType: updatedUser.accountType,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveUserCV = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cv = {
      template: req.body.template,
      data: req.body.data,
    };

    await user.save();

    res.json({
      message: "CV saved successfully",
      cv: user.cv,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserCV = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("cv");

    res.json({
      cv: user.cv || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};