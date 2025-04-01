const Listing = require("../models/listing");

// Display all listings
module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get page number from query or default to 1
    const limit = 8; // Listings per page
    const skip = (page - 1) * limit; // Calculate skip value

    const allListings = await Listing.find({})
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

    const totalListings = await Listing.countDocuments(); // Total count of listings
    const totalPages = Math.ceil(totalListings / limit); // Calculate total pages

    res.render("listings/index.ejs", { allListings, totalPages, currentPage: page });
};

// Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show details of a single listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Requested listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Create a new listing
module.exports.createListing = async (req, res) => {
    const { path: url, filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

// Render form to edit a listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Requested listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

// Update an existing listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
