const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const path = require("path");
const jwt = require("jsonwebtoken");

exports.signup = [
  // Validate request body fields
  body("username", "Username required").trim().isLength({ min: 1 }).escape(),
  body("password", "Password required").trim().isLength({ min: 1 }).escape(),
  body("email", "Email required").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user with the same email or username already exists
      const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });
      if (existingUser) {
        return res.status(400).json({
          message: "User with the same email or username already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create new user object
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      });

      // Save user to the database
      await user.save();

      // Return success response
      res.status(201).json({ message: "User created" });
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  },
];

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  // handle on the client side
  res.json({ message: "Logout successful" });
};
