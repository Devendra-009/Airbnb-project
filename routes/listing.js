const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // Import User model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Get or create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, update, delete routes
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

/* ---------------------- FAVORITES / WISHLIST FUNCTIONALITY ---------------------- */

// Add listing to favorites
router.post("/:id/favorite", isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(listing._id)) {
        user.favorites.push(listing._id);
        await user.save();
    }

    req.flash("success", "Listing added to favorites!");
    res.redirect(`/listings/${listing._id}`);
}));

// Remove listing from favorites
router.post("/:id/unfavorite", isLoggedIn, wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(favId => favId.toString() !== req.params.id);
    await user.save();

    req.flash("success", "Listing removed from favorites!");
    res.redirect(`/listings/${req.params.id}`);
}));

// View favorite listings
router.get("/favorites", isLoggedIn, wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("listings/favorites.ejs", { favoriteListings: user.favorites });
}));

module.exports = router;
