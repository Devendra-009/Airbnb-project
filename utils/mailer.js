const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (toEmail, userName, listingName, bookingDate) => {
  const mailOptions = {
    from: `"ExploreLust" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Booking Confirmation - ExploreLust",
    html: `
      <h2>Hello ${userName},</h2>
      <p>Your booking for <strong>${listingName}</strong> on <strong>${bookingDate}</strong> is confirmed!</p>
      <p>Thank you for choosing ExploreLust. We hope you have a great stay!</p>
      <br>
      <p>Regards,<br>ExploreLust Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent.");
  } catch (err) {
    console.error("Error sending booking email:", err);
  }
};

module.exports = sendBookingConfirmation;
