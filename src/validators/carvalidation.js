const { body, check } = require("express-validator");
const { readStore } = require("../data/fileHandling");
const { obj } = require("../utils/fuelenums");

const carAddValidator = [
  body("sName").notEmpty().isString().withMessage("Car name is required"),

  body("sColor").notEmpty().isString().withMessage("Color is required"),

  body("sFuel")
    .isString()
    .isIn(obj.sFuel.enum)
    .withMessage("Fuel type must be one of allowed values"),

  body("sModel").notEmpty().isString().withMessage("Model is required"),

  body("nYear").isInt().withMessage("Year must be an integer"),

  body().custom((body) => {
    const oStore = readStore();
    const cars = oStore.cars || [];

    const isDuplicate = cars.some((c) => {
      return (
        (c.sName === body.sName && c.sColor === body.sColor) ||
        (c.sName === body.sName && c.sModel === body.sModel) ||
        (c.sName === body.sName && c.nYear === body.nYear) ||
        (c.sName === body.sName && c.sFuel === body.sFuel) ||
        (c.sName === body.sName &&
          c.sColor === body.sColor &&
          c.sModel === body.sModel &&
          c.nYear === body.nYear &&
          c.sFuel === body.sFuel)
      );
    });

    if (isDuplicate) {
      throw new Error("Car with the same combination already exists");
    }

    return true;
  }),
];

const carUpdateValidator = [
  check("iId").isUUID().withMessage("Invalid ID!"),
  body().custom(body).notEmpty(),
  body("sName")
    .isString()
    .custom((value, { req }) => {
      const oStore = readStore();
      const sParamId = req.params.iId;

      const existingCar = oStore.cars.find((c) => c.iId === sParamId);
      if (!existingCar) {
        throw new Error("Car not found for update");
      }

      const isConflict = oStore.cars.some(
        (c) => c.sName === value && c.iId !== sParamId
      );

      if (isConflict) {
        throw new Error("Another car with this name already exists");
      }

      return true;
    }),
  body("sColor")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Color is required"),

  body("sFuel")
    .optional()
    .isString()
    .isIn(obj.sFuel.enum)
    .withMessage("Fuel type must be one of allowed values"),

  body("sModel")
    .optional()
    .notEmpty()
    .isString()
    .withMessage("Model is required"),

  body("nYear").optional().isInt().withMessage("Year must be an integer"),
];
const deletecarvalidator = [check("iId").isUUID().withMessage("Invalid ID")];

module.exports = {
  carAddValidator,
  carUpdateValidator,
  deletecarvalidator,
};
