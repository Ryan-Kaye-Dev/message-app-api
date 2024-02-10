const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

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
