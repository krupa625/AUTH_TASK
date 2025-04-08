const generateOTP = require("../utils/otpGenerator");
const { STATUS_CODES } = require("../utils/statuscode.js");
const { usersessions } = require("../configure/config.js");
const { readStore, writeStore } = require("../data/fileHandling.js");
const { createToken, verifyToken } = require("../utils/jwt");
const { sendMail } = require("../utils/mail");

const userlogin = (req, res) => {
  const { email, otp } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const oStore = readStore();
  if (!oStore.users) oStore.users = [];
  if (!oStore.otps) oStore.otps = {};
  if (!oStore.userSessions) oStore.userSessions = {};

  const exists = oStore.users.some((u) => u.email === email);
  if (!exists) {
    oStore.users.push({ email });
  }

  if (!otp) {
    const nOtp = generateOTP();
    oStore.otps[email] = nOtp;

    writeStore(oStore);
    console.log("OTP sent to:", email);
    sendMail(email, "Your OTP for login", `Your OTP is: ${nOtp}`);
    return res.json({ message: "OTP sent to your email" });
  }

  if (oStore.otps[email] !== otp) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  delete oStore.otps[email];
  const oUser = oStore.users.find((u) => u.email === email);
  if (!oUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const oToken = createToken({ email, role: "user" });

  if (!oStore.userSessions[email]) {
    oStore.userSessions[email] = [];
  }

  if (oStore.userSessions[email].length >= usersessions) {
    oStore.userSessions[email].shift();
  }

  oStore.userSessions[email].push(oToken);
  writeStore(oStore);

  res.json({ message: "Login successful", token: oToken });
};

const userlogout = (req, res) => {
  const oToken = req.headers.authorization?.split(" ")[1];
  const role = "user";
  const oPayload = verifyToken(oToken, role);

  if (!oPayload)
    return res
      .status(STATUS_CODES.Unauthorized)
      .json({ message: "Invalid token" });

  const { email } = oPayload;
  const oStore = readStore();

  if (oStore.userSessions[email]) {
    oStore.userSessions[email] = oStore.userSessions[email].filter(
      (t) => t !== oToken
    );
    writeStore(oStore);
  }

  res.json({ message: "User logged out" });
};

const viewcar = (req, res) => {
  // console.log(req.user);

  const oStore = readStore();
  res.json({ cars: oStore.cars });
};

module.exports = {
  userlogin,
  userlogout,
  viewcar,
};
