import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { setAuthCookie, signToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const safeUser = (u) => ({
  id: u._id, name: u.name, email: u.email, avatar: u.avatar,
  bio: u.bio, phone: u.phone, role: u.role, favorites: u.favorites || []
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, "Name, email and password are required");
  if (password.length < 6) throw new ApiError(400, "Password must be at least 6 characters");
  if (await User.findOne({ email: email.toLowerCase() })) throw new ApiError(409, "Email is already registered");
  const user = await User.create({ name, email, password });
  setAuthCookie(res, signToken(user._id));
  res.status(201).json({ success: true, user: safeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password || ""))) throw new ApiError(401, "Invalid email or password");
  setAuthCookie(res, signToken(user._id));
  res.json({ success: true, user: safeUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user: safeUser(user) });
});
