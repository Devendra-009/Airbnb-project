const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Show all favorite listings
router.get("/", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("listings/favorites", { favoriteListings: user.favorites });
});

// Add listing to favorites
router.post("/:id", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id);
    const listingId = req.params.id;

    if (!user.favorites.includes(listingId)) {
        user.favorites.push(listingId);
        await user.save();
    }

    // Check if request is AJAX
    if (req.xhr) {
        return res.json({ success: true, action: "added" });
    }

    res.redirect("/favorites");
});

// Remove listing from favorites
router.delete("/:id", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
    await user.save();

    // Check if request is AJAX
    if (req.xhr) {
        return res.json({ success: true, action: "removed" });
    }

    res.redirect("/favorites");
});

// Toggle favorite via AJAX (for buttons outside show.ejs)
// Toggle favorites (Add/Remove)
router.post("/:id/toggle", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id);
    const listingId = req.params.id;

    if (user.favorites.includes(listingId)) {
        user.favorites = user.favorites.filter(id => id.toString() !== listingId);
        await user.save();
        return res.json({ success: true, action: "removed" });
    } else {
        user.favorites.push(listingId);
        await user.save();
        return res.json({ success: true, action: "added" });
    }
});

module.exports = router;
