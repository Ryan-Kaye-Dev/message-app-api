const { body, validationResult } = require("express-validator");
const path = require("path");
const jwt = require("jsonwebtoken");
const chatroom = require("../models/chatroom.js");

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
      await Chatroom.save();

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
