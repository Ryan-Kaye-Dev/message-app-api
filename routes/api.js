var express = require("express");
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController.js");
const chatroom_controller = require("../controllers/chatroomController.js");
const message_controller = require("../controllers/messageController.js");

// index route
router.get("/", function (req, res, next) {
  res.redirect("/api");
});

// create user - api/signup
router.post("/signup", user_controller.signup);

// login user - api/login
router.post("/login", user_controller.login);

// get user details - api/user
router.get("/user", user_controller.getuser);

// create chatroom - api/chatroom/create
router.post("/chatrooms/create", chatroom_controller.create_chatroom);

// get chatroom - api/chatroom/:id
router.post("/chatrooms/:id", chatroom_controller.get_chatroom);

// get all chatrooms - api/chatrooms
router.get("/chatrooms", chatroom_controller.get_all_chatrooms);

// create new message in chatroom - api/chatrooms/:id/messages
router.post("/chatrooms/:id/messages", message_controller.new_message);

// get messages in chatroom - api/chatrooms/:id/messages
router.get(
  "/chatrooms/:id/messages",
  chatroom_controller.get_chatroom_messages
);

module.exports = router;
