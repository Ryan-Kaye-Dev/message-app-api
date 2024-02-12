var express = require("express");
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController.js");

// index route
router.get("/", function (req, res, next) {
  res.redirect("/api");
});

// create user - api/signup
router.post("/signup", user_controller.signup);

// login user - api/login
router.post("/login", user_controller.login);

// get user details - api/user
router.get("/user/:id", user_controller.getuser);

module.exports = router;
