var express = require("express");
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");

// index route
router.get("/", function (req, res, next) {
  res.redirect("/api");
});

// create user - api/signup
router.post("/signup", user_controller.signup);

// create user api/signup get
router.get("/signup", function (req, res, next) {
  res.send("Hi");
});

module.exports = router;
