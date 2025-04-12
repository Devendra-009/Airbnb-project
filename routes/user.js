const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const multer = require("multer");  // Import multer
const { uploadToCloudinary } = require('../controllers/users'); // Make sure this function exists if you're using it
const sendWelcomeEmail = require("../utils/sendEmail");
const userController = require("../controllers/users.js");

// Multer setup for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage }).single('profilePicture'); // Initialize multer for single file upload with the name 'profilePicture'

// Signup Route
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));


  // SIGNUP ROUTE
router.post("/signup", wrapAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Email format check
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailPattern.test(email)) {
    req.flash("error", "Invalid email format.");
    return res.redirect("/signup");
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    req.flash("error", "Email already registered. Try logging in.");
    return res.redirect("/signup");
  }

  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, (err) => {
    if (err) return next(err);
    req.flash("success", "Welcome to ExploreLust!");
    res.redirect("/listings");
  });
}));

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


// After successful registration:
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    await sendWelcomeEmail(email, username);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to ExploreLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});


module.exports = router;
