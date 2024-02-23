const { body, validationResult } = require("express-validator");
const path = require("path");
const jwt = require("jsonwebtoken");
const Chatroom = require("../models/chatroom.js");

exports.create_chatroom = [
  // Validate request body fields
  body("name", "Chatroom Name required").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if Chatroom with the same name already exists
      const existingChatroom = await Chatroom.findOne({
        name: req.body.name,
      });
      if (existingChatroom) {
        return res.status(400).json({
          message: "Chatroom already exists",
        });
      }

      // Create new Chatroom object
      const chatroom = new Chatroom({
        name: req.body.name,
      });

      // Save user to the database
      await chatroom.save();

      // Return success response
      res.status(201).json({ message: "Chatroom created" });
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  },
];

exports.get_chatroom = async function (req, res, next) {
  Chatroom.findById(req.params.chatroomid, function (err, chatroom) {
    if (err) {
      return next(err);
    }
    if (chatroom === null) {
      return res.status(404).json({ message: "Chatroom not found" });
    }
    res.json(chatroom);
  });
};

exports.get_all_chatrooms = async function (req, res, next) {
  try {
    const chatrooms = await Chatroom.find().populate("name");
    res.json(chatrooms);
  } catch (error) {
    next(error);
  }
};

exports.get_chatroom_messages = async function (req, res, next) {
  try {
    // Find the chatroom by its ID and populate the messages field
    const chatroom = await Chatroom.findById(req.params.id).populate(
      "messages"
    );

    // If the chatroom is not found, return a 404 response
    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    // Extract the messages from the chatroom
    const messages = chatroom.messages;

    // Return the messages in the response
    res.json(messages);
  } catch (err) {
    // If an error occurs, pass it to the error handler middleware
    next(err);
  }
};
