import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { sendBookingConfirmation } from "../utils/mailer.js";

function nightsBetween(a, b) {
  return Math.ceil((new Date(b) - new Date(a)) / 86400000);
}

export const createBooking = asyncHandler(async (req, res) => {
  const { listingId, checkIn, checkOut, guests } = req.body;
  const listing = await Listing.findById(listingId);
  if (!listing) throw new ApiError(404, "Listing not found");
  const inDate = new Date(checkIn), outDate = new Date(checkOut);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime()) || outDate <= inDate) throw new ApiError(400, "Invalid booking dates");
  if (new Date(inDate.toDateString()) < new Date(new Date().toDateString())) throw new ApiError(400, "Check-in cannot be in the past");
  if (Number(guests) < 1 || Number(guests) > listing.maxGuests) throw new ApiError(400, `Maximum guests for this listing: ${listing.maxGuests}`);

  const conflict = await Booking.findOne({
    listing: listingId, status: "confirmed",
    checkIn: { $lt: outDate }, checkOut: { $gt: inDate }
  });
  if (conflict) throw new ApiError(409, "Those dates are already booked");

  const nights = nightsBetween(inDate, outDate);
  const totalPrice = nights * listing.price;
  const booking = await Booking.create({ listing: listingId, user: req.user._id, checkIn: inDate, checkOut: outDate, guests: Number(guests), totalPrice });
  await sendBookingConfirmation({ to: req.user.email, name: req.user.name, listing: listing.title, checkIn: inDate.toISOString().slice(0,10), checkOut: outDate.toISOString().slice(0,10), guests, totalPrice }).catch(e => console.error("Email error:", e.message));
  const populated = await booking.populate("listing", "title images location price");
  res.status(201).json({ success: true, booking: populated });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing", "title images location price").sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (String(booking.user) !== String(req.user._id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized");
  if (booking.status === "cancelled") return res.json({ success: true, message: "Booking already cancelled" });
  booking.status = "cancelled";
  await booking.save();
  res.json({ success: true, booking });
});
