const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const multer = require("multer");  // Import multer
const { uploadToCloudinary } = require('../controllers/users'); // Make sure this function exists if you're using it

const userController = require("../controllers/users.js");

// Multer setup for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage }).single('profilePicture'); // Initialize multer for single file upload with the name 'profilePicture'

// Signup Route
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// Login Route
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

// Logout Route
router.get("/logout", userController.logout);

// My Profile Route
router.get("/profile", isLoggedIn, wrapAsync(userController.renderProfile));

// Settings Route - Render settings page (GET request)
router.get("/settings", isLoggedIn, wrapAsync(async (req, res) => {
  try {
    // Retrieve flash messages
    const messages = req.flash("error").concat(req.flash("success"));

    // Render settings page and pass flash messages
    res.render("users/settings", { messages, user: req.user });
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
}));

// Settings Route - Handle settings form submission (POST request)
router.post(
  '/settings',
  isLoggedIn,  // Middleware to check if the user is logged in
  upload,  // Multer middleware for file upload
  wrapAsync(userController.updateSettings)  // Controller function to update user settings
);

module.exports = router;
