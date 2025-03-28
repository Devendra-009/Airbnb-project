const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema , reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
          req.flash("error", "You must be logged in to create a new listing");
          return res.redirect("/login")
        }
        next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req,res,next) =>{
  let { id } = req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have any access");
        return res.redirect(`/listings/${id}`);
      }
      next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validating data inside req.body using joi's schema.
  if (error) {
    throw new ExpressError(400, error.message); // If there is error, then throw it.
  } else {
    next(); // If there is no error, call next middleware.
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // Validating data inside req.body using joi's schema.
  if (error) {
      throw new ExpressError(400, error.message); // If there is error, then throw it.
  } else {
      next(); // If there is no error, call next middleware.
  }
};


module.exports.isReviewAuthor = async (req,res,next) =>{
  let { id,reviewId } = req.params;
      let review = await Review.findById(reviewId);
      if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have any access");
        return res.redirect(`/listings/${id}`);
      }
      next();
};