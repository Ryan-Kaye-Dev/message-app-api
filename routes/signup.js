var express = require("express");
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");

/* POST Sign Up Page */
router.post("/signup", user_controller.signup_post);
module.exports = router;
