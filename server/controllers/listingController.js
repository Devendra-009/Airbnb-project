import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "explorelust/listings" },
      (error, result) => error ? reject(error) : resolve(result));
    stream.end(file.buffer);
  });
}

export const getListings = asyncHandler(async (req, res) => {
  const { search, category, location, minPrice, maxPrice, guests, sort = "newest", page = 1, limit = 12 } = req.query;
  const query = {};
  if (search) query.$text = { $search: search };
  if (category && category !== "all") query.category = category;
  if (location) query.location = { $regex: location, $options: "i" };
  if (guests) query.maxGuests = { $gte: Number(guests) };
  if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
  const sortMap = { newest: { createdAt: -1 }, priceLow: { price: 1 }, priceHigh: { price: -1 }, rating: { ratingAverage: -1 } };
  const pageNum = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 50);
  const [items, total] = await Promise.all([
    Listing.find(query).populate("owner", "name avatar").sort(sortMap[sort] || sortMap.newest).skip((pageNum - 1) * pageSize).limit(pageSize),
    Listing.countDocuments(query)
  ]);
  res.json({ success: true, listings: items, pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
});

export const getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("owner", "name avatar");
  // Reviews are queried separately because Listing stores no review array.
  if (!listing) throw new ApiError(404, "Listing not found");
  const Review = (await import("../models/Review.js")).default;
  const reviews = await Review.find({ listing: listing._id }).populate("author", "name avatar").sort({ createdAt: -1 });
  res.json({ success: true, listing, reviews });
});

export const createListing = asyncHandler(async (req, res) => {
  const { title, description, category, price, maxGuests, location, country, amenities } = req.body;
  if (!title || !description || !price || !maxGuests || !location) throw new ApiError(400, "Title, description, price, guests and location are required");
  const images = [];
  for (const file of (req.files || []).slice(0, 8)) {
    const result = await uploadBuffer(file);
    images.push({ url: result.secure_url, publicId: result.public_id });
  }
  if (!images.length) throw new ApiError(400, "At least one listing image is required");
  const listing = await Listing.create({
    title, description, category: category || "Stay", price: Number(price), maxGuests: Number(maxGuests),
    location, country: country || "India",
    amenities: Array.isArray(amenities) ? amenities : (amenities ? String(amenities).split(",").map(s => s.trim()).filter(Boolean) : []),
    images, owner: req.user._id
  });
  res.status(201).json({ success: true, listing });
});

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ApiError(404, "Listing not found");
  if (String(listing.owner) !== String(req.user._id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized");
  const fields = ["title","description","category","price","maxGuests","location","country"];
  fields.forEach(k => { if (req.body[k] !== undefined) listing[k] = k === "price" || k === "maxGuests" ? Number(req.body[k]) : req.body[k]; });
  if (req.body.amenities !== undefined) listing.amenities = Array.isArray(req.body.amenities) ? req.body.amenities : String(req.body.amenities).split(",").map(s => s.trim()).filter(Boolean);
  if (req.files?.length) {
    for (const file of req.files.slice(0, 8)) {
      const result = await uploadBuffer(file);
      listing.images.push({ url: result.secure_url, publicId: result.public_id });
    }
  }
  await listing.save();
  res.json({ success: true, listing });
});

export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ApiError(404, "Listing not found");
  if (String(listing.owner) !== String(req.user._id) && req.user.role !== "admin") throw new ApiError(403, "Not authorized");
  await Listing.findByIdAndDelete(listing._id);
  res.json({ success: true, message: "Listing deleted" });
});

export const myListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, listings });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const user = await (await import("../models/User.js")).default.findById(req.user._id);
  const id = req.params.id;
  const exists = user.favorites.some(x => String(x) === id);
  user.favorites = exists ? user.favorites.filter(x => String(x) !== id) : [...user.favorites, id];
  await user.save();
  res.json({ success: true, favorited: !exists, favorites: user.favorites });
});

export const getFavorites = asyncHandler(async (req, res) => {
  const user = await (await import("../models/User.js")).default.findById(req.user._id).populate("favorites");
  res.json({ success: true, listings: user.favorites });
});
