const { createToken, verifyToken } = require("../utils/jwt");
const { readStore, writeStore } = require("../data/fileHandling.js");
const { adminsessions } = require("../configure/config.js");
const { Cars } = require("../models/cars.js");
const { STATUS_CODES } = require("../utils/statuscode.js");

const adminlogin = (req, res) => {
  try {
    const { email, password } = req.body;

    const oStore = readStore();

    const oAdmin = oStore.admins.find(
      (a) => a.email === email && a.password === password
    );

    if (!oAdmin) {
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ message: "Invalid credentials" });
    }

    const oToken = createToken({ email, role: "admin" });

    if (!oStore.adminSessions[email]) {
      oStore.adminSessions[email] = [];
    }

    if (oStore.adminSessions[email].length >= adminsessions) {
      oStore.adminSessions[email].shift();
    }

    oStore.adminSessions[email].push(oToken);
    writeStore(oStore);

    res.json({ oToken });
  } catch (error) {
    // console.error("Admin Login Error:", error.message);
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const adminlogout = (req, res) => {
  try {
    const oToken = req.headers.authorization?.split(" ")[1];
    const role = "admin";

    if (!oToken) {
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ message: "Token missing" });
    }

    const oPayload = verifyToken(oToken, role);
    if (!oPayload || oPayload.role !== "admin" || !oPayload.email) {
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ message: "Invalid or expired token" });
    }

    const oStore = readStore();

    if (oStore.adminSessions[oPayload.email]) {
      oStore.adminSessions[oPayload.email] = oStore.adminSessions[
        oPayload.email
      ].filter((t) => t !== oToken);
      writeStore(oStore);
      return res
        .status(STATUS_CODES.OK)
        .json({ message: "Logged out successfully" });
    }

    return res
      .status(STATUS_CODES.BadRequest)
      .json({ message: "Session not found" });
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const addcar = (req, res) => {
  try {
    const { sName, sColor, sFuel, sModel, nYear } = req.body;
    const oNewcar = new Cars(sName, sColor, sFuel, sModel, nYear);
    const oStore = readStore();

    oStore.cars.push(oNewcar);
    writeStore(oStore);

    res.json({ message: "Car added" });
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const updatecar = (req, res) => {
  try {
    const oStore = readStore();
    const oCar = oStore.cars.find((c) => c.iId === req.params.iId);

    if (!oCar)
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "Car not found" });

    Object.assign(oCar, req.body);
    writeStore(oStore);

    res.json({ message: "Car updated", oCar });
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const deletecar = (req, res) => {
  try {
    const oStore = readStore();
    const nIndex = oStore.cars.findIndex((c) => c.iId === req.params.iId);
    console.log("jj");

    if (nIndex === -1)
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "Car not found" });

    oStore.cars.splice(nIndex, 1);
    writeStore(oStore);

    res.json({ message: "Car deleted" });
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { adminlogin, adminlogout, addcar, updatecar, deletecar };
