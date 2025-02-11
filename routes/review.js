const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// const { listingSchema, reviewSchema } = require("../schema");
const { validateReview ,isLoggedIn ,isReviewAuthor } = require("../middleware.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const reviewController = require("../controllers/reviews.js");

//route for reviews //each list has it own  review
//post review
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,

  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
