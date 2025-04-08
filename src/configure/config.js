require("dotenv").config();

module.exports = {
  port: process.env.PORT || 2000,
  userkey: process.env.USER_KEY || "kkkk",
  adminkey: process.env.ADMIN_KEY || "admin",
  expiryin: process.env.EXPIRY_TOKEN || "30m",
  usersessions: process.env.USER_SESSIONS || 3,
  adminsessions: process.env.ADMIN_SESSIONS || 1,
  senderemail: process.env.SENDER_EMAIL,
  senderpass: process.env.SENDER_PASS,
};
