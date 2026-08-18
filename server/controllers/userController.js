import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "explorelust/avatars" },
      (error, result) => error ? reject(error) : resolve(result));
    stream.end(file.buffer);
  });
}

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites", "title price images location ratingAverage");
  res.json({ success: true, user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  const { name, bio, phone } = req.body;
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (phone !== undefined) user.phone = phone;
  if (req.file) {
    if (user.avatar?.includes("cloudinary.com")) {
      // Old avatar cleanup is intentionally best-effort.
    }
    const result = await uploadBuffer(req.file);
    user.avatar = result.secure_url;
  }
  await user.save();
  res.json({ success: true, user });
});
