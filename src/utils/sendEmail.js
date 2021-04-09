const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const sendEmail = (userEmail, emailToken, host) => {
  transporter.sendMail({
    to: userEmail,
    from: "adibu8@gmail.com",
    subject: "Account Verification Link",
    html: `
          <p>Please verify your account by clicking this <b><a href="http://${host}/user/confirmation/${userEmail}/${emailToken}">link</a>.<b></p>
        `,
  });
};

module.exports = sendEmail;
