const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ExploreLust" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Welcome to ExploreLust!",
      html: `
        <h2>Hello ${userName},</h2>
        <p>Thank you for signing up at <b>ExploreLust</b>! 🎉</p>
        <p>We’re excited to have you on board. Start exploring your next adventure now!</p>
        <br/>
        <p>Cheers,<br/>The ExploreLust Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", userEmail);
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
  }
};

module.exports = sendWelcomeEmail;
