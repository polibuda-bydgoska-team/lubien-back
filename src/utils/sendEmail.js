const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const sendEmail = (userEmail, subject, htmlBody) => {
  transporter.sendMail({
    to: userEmail,
    from: "adibu8@gmail.com",
    subject: subject,
    html: htmlBody,
  });
};

module.exports = sendEmail;
