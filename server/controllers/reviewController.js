import Review from "../models/Review.js";
import Listing from "../models/Listing.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

async function refreshRating(listingId) {
  const stats = await Review.aggregate([
    { $match: { listing: listingId } },
    { $group: { _id: "$listing", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const s = stats[0] || { avg: 0, count: 0 };
  await Listing.findByIdAndUpdate(listingId, { ratingAverage: Math.round(s.avg * 10) / 10, reviewCount: s.count });
}

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ listing: req.params.listingId }).populate("author", "name avatar").sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const listing = await Listing.findById(req.params.listingId);
  if (!listing) throw new ApiError(404, "Listing not found");
  if (!rating || !comment) throw new ApiError(400, "Rating and comment are required");
  const review = await Review.create({ listing: listing._id, author: req.user._id, rating: Number(rating), comment });
  await refreshRating(listing._id);
  const populated = await review.populate("author", "name avatar");
  res.status(201).json({ success: true, review: populated });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");
  if (String(review.author) !== String(req.user._id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized");
  await review.deleteOne();
  await refreshRating(review.listing);
  res.json({ success: true });
});
