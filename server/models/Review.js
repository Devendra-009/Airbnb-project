import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true, maxlength: 1000 }
}, { timestamps: true });

reviewSchema.index({ listing: 1, author: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
