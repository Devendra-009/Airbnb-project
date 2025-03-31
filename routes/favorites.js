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
    
    res.redirect("/favorites");
});

// Remove listing from favorites
router.delete("/:id", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.redirect("/favorites");
});

module.exports = router;
