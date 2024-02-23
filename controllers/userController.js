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

// get current logged in in user
exports.getuser = async (req, res, next) => {
  try {
    // Get the JWT token from the request headers or cookies
    const token = req.headers.authorization.split(" ")[1]; // Assuming token is sent in the Authorization header

    // Decode the JWT token to access the payload
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user ID from the decoded token
    const userId = decodedToken.id;

    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user details including the user ID in the response
    res.json({
      userId: user._id, // Include user ID in the response
      username: user.username,
      avatar: user.avatar,
      friends: user.friends,
    });
  } catch (error) {
    // Handle JWT verification errors or other errors
    next(error);
  }
};

// get other user
exports.get_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      // Check if user is found
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user }); // Send user data if found
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" }); // Handle internal server error
  }
};
