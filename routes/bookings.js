const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const sendBookingConfirmation = require("../utils/mailer");

// 📌 Handle Booking Submission
router.post("/:id/book", isLoggedIn, async (req, res) => {
    try {
        const { checkIn, checkOut, guests } = req.body;
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const booking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkIn,
            checkOut,
            guests
        });

        await booking.save();

        // Send confirmation email 📧
        if (req.user.email) {
            await sendBookingConfirmation(
                req.user.email,
                req.user.username || req.user.name || "Guest",
                listing.title,
                `${checkIn} to ${checkOut}`
            );
        }

        req.flash("success", "Booking confirmed! A confirmation email has been sent.");
        res.redirect("/bookings");
    } catch (err) {
        console.error("Booking Error:", err);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
});

// 📌 Show My Bookings
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("listing");
        res.render("bookings/index", { bookings });
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not fetch bookings.");
        res.redirect("/listings");
    }
});

// 📌 Cancel Booking
router.delete("/:id/cancel", isLoggedIn, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            req.flash("error", "Booking not found.");
            return res.redirect("/bookings");
        }

        if (!booking.user.equals(req.user._id)) {
            req.flash("error", "You are not authorized to cancel this booking.");
            return res.redirect("/bookings");
        }

        await Booking.findByIdAndDelete(req.params.id);
        req.flash("success", "Booking canceled successfully.");
        res.redirect("/bookings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while canceling the booking.");
        res.redirect("/bookings");
    }
});

module.exports = router;
