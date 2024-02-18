var express = require("express");
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController.js");
const chatroom_controller = require("../controllers/chatroomController.js");

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

module.exports = router;
