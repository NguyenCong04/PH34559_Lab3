var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nguyentatcong10x@gmail.com",
    pass: "qyrtcmvlnfbyxjlc",
  },
});

module.exports = transporter;
