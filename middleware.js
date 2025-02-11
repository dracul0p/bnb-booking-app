const Listing = require("./models/listing"); // Import your User model
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");

const { listingSchema  , reviewSchema} = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
//   console.log(req.path ,".." , req.originalUrl); // This will only log if the user is authenticated

  if (!req.isAuthenticated()) {
    //redirect Url
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    // If there is a redirectUrl stored in the session
    if (req.session.redirectUrl) {
      // Store the redirectUrl in res.locals to pass it to the view

      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  };

  module.exports.isOwner =  async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }

  // module.exports.validateListing = (req, res, next) => {
  //   let { error } = listingSchema.validate(req.body, { abortEarly: false });
  
  //   if (error) {
  //     let errMsg = error.details.map((el) => el.message).join(", ");
  //     throw new ExpressError(400, errMsg);
  //   } else {
  //     next();
  //   }
  // };

  module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports.isReviewAuthor =  async(req, res, next) => {
    let {id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "you did not create this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }