const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Message = require("../models/message.js");
const User = require("../models/user.js");
const Chatroom = require("../models/chatroom.js");

exports.new_message = [
  // Validate request body fields
  body("message", "Message required").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
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

      const message = new Message({
        sender: user,
        message: req.body.message,
        chatroom: req.body.chatroomid,
      });

      // Save message to the database
      await message.save();

      // update the chatroom's message array
      await Chatroom.findByIdAndUpdate(req.body.chatroom, {
        $push: { messages: message._id },
      });

      // Return success response
      res.status(201).json({ message: "Message created" });
    } catch (err) {
      next(err);
    }
  },
];