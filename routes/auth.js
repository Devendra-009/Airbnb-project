const express = require("express");
const passport = require("passport");
const router = express.Router();

// Initiate Google login
router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  }));
  
  // Callback after Google login
  router.get("/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    function (req, res) {
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
