const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google OAuth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google callback
router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

// Optional: Logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
