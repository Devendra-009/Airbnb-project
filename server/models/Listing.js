import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: "" }
}, { _id: false });

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120, index: true },
  description: { type: String, required: true, maxlength: 3000 },
  category: { type: String, default: "Stay", index: true },
  images: { type: [imageSchema], default: [] },
  price: { type: Number, required: true, min: 0, index: true },
  maxGuests: { type: Number, required: true, min: 1, default: 2 },
  location: { type: String, required: true, trim: true, index: true },
  country: { type: String, default: "India", trim: true },
  amenities: [{ type: String, trim: true }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  ratingAverage: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

listingSchema.index({ title: "text", description: "text", location: "text", country: "text" });

export default mongoose.model("Listing", listingSchema);
