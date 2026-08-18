import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const stats = asyncHandler(async (req, res) => {
  const [users, listings, bookings, revenue] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Booking.countDocuments({ status: { $ne: "cancelled" } }),
    Booking.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }])
  ]);
  res.json({ success: true, stats: { users, listings, bookings, revenue: revenue[0]?.total || 0 } });
});

export const users = asyncHandler(async (req, res) => {
  const items = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users: items });
});

export const bookings = asyncHandler(async (req, res) => {
  const items = await Booking.find().populate("user", "name email").populate("listing", "title").sort({ createdAt: -1 });
  res.json({ success: true, bookings: items });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) throw new ApiError(400, "You cannot delete your own admin account");
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
