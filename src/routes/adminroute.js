const express = require("express");
const router = express.Router();

const {
  carAddValidator,
  carUpdateValidator,
  deletecarvalidator,
} = require("../validators/carvalidation.js");
const {
  adminlogin,
  adminlogout,
  addcar,
  updatecar,
  deletecar,
} = require("../controller/adminController.js");
const { validateRequest } = require("../middleware/resultvalidate.js");

const authAdmin = require("../middleware/auth.js")("admin");

router.post("/admin/login", adminlogin);

router.post("/admin/logout", adminlogout);

router.post("/car", authAdmin, carAddValidator, validateRequest, addcar);

router.put(
  "/car/:iId",
  authAdmin,
  carUpdateValidator,
  validateRequest,
  updatecar
);

router.delete(
  "/car/:iId",
  authAdmin,
  deletecarvalidator,
  validateRequest,
  deletecar
);

module.exports = router;
