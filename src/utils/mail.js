const nodemailer = require("nodemailer");
const { senderemail, senderpass } = require("../configure/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderemail,
    pass: senderpass,
  },
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: senderemail,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = { sendMail };
