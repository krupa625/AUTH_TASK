const jwt = require("jsonwebtoken");
const { userkey, adminkey, expiryin } = require("../configure/config");

const createToken = (payload) => {
  try {
    const { role } = payload;

    let secret;
    if (role === "admin") {
      secret = adminkey;
    } else if (role === "user") {
      secret = userkey;
    } else {
      throw new Error("Invalid role for token generation");
    }

    return jwt.sign(payload, secret, { expiresIn: expiryin });
  } catch (error) {
    console.error("Token creation failed:", error.message);
    return null;
  }
};

const verifyToken = (token, role) => {
  try {
    let secret;
    if (role === "admin") {
      secret = adminkey;
    } else if (role === "user") {
      secret = userkey;
    } else {
      throw new Error("Invalid role for verification");
    }

    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

module.exports = { createToken, verifyToken };
