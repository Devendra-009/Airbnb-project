import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, minlength: 6, select: false },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "", maxlength: 500 },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }]
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
