import nodemailer from "nodemailer";

function transporter() {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT || 587),
    secure: Number(process.env.MAIL_PORT || 587) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

export async function sendBookingConfirmation({ to, name, listing, checkIn, checkOut, guests, totalPrice }) {
  const mailer = transporter();
  if (!mailer) return;
  await mailer.sendMail({
    from: `"ExploreLust" <${process.env.MAIL_USER}>`,
    to,
    subject: `Booking confirmed — ${listing}`,
    html: `<h2>Booking confirmed</h2>
      <p>Hello ${name},</p>
      <p>Your stay at <strong>${listing}</strong> is confirmed.</p>
      <p>${checkIn} → ${checkOut} · ${guests} guest(s)</p>
      <p>Total: ₹${totalPrice}</p>`
  });
}
