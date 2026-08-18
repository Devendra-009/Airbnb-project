import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Listing from "./models/Listing.js";
import { connectDB } from "./config/db.js";

await connectDB();
const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
let admin = await User.findOne({ email });
if (!admin) admin = await User.create({ name: "Admin", email, password, role: "admin" });
else { admin.role = "admin"; await admin.save(); }
if (!await Listing.findOne({ owner: admin._id })) {
  await Listing.create({
    title: "Demo Mountain Retreat",
    description: "A demo listing for local development. Replace this with your real property.",
    category: "Cabin", price: 2500, maxGuests: 4, location: "Manali", country: "India",
    amenities: ["WiFi","Parking","Kitchen"], owner: admin._id,
    images: [{ url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80" }]
  });
}
console.log(`Seeded admin: ${email}`);
await mongoose.disconnect();
