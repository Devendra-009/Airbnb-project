import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";

export async function protect(req, res, next) {
  try {
    const token = req.cookies.token || (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1] : null);
    if (!token) throw new ApiError(401, "Authentication required");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) throw new ApiError(401, "User no longer exists");
    req.user = user;
    next();
  } catch (err) {
    next(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"
      ? new ApiError(401, "Invalid or expired session")
      : err);
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") return next(new ApiError(403, "Admin access required"));
  next();
}
