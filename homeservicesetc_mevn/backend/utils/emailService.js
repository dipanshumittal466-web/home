const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

exports.sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: config.email.user,
      to,
      subject,
      html
    });
    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email Error:", err.message);
  }
};
