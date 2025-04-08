const express = require("express");
const router = express.Router();
const {
  userlogout,
  viewcar,
  userlogin,
} = require("../controller/userController.js");

const authUser = require("../middleware/auth.js")("user");
router.post("/user/login", userlogin);

router.post("/user/logout", authUser, userlogout);
router.get("/viewcars", authUser, viewcar);

module.exports = router;
