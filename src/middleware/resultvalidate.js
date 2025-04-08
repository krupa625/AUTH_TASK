const { STATUS_CODES } = require("../utils/statuscode");
const { validationResult } = require("express-validator");
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BadRequest).json(errors);
  }
  next();
};
module.exports = { validateRequest };
