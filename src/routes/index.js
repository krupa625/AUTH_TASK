const express = require("express");
const adminroute = require("../routes/adminroute");
const userroute = require("../routes/userroute");

const router = express.Router();

router.use("/", adminroute, userroute);

module.exports = router;
