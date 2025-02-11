const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {
    // console.log(req.body); // Log to check the data
    //  console.log(req.params.id);

    let listing = await Listing.findById(req.params.id);
    let reviewData = req.body.review;

    // Convert rating to a number
    // reviewData.rating = Number(reviewData.rating);

    let newReview = new Review(reviewData);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    
    

    await newReview.save();
    await listing.save();
    // console.log("Saved new review");

    req.flash("success", "New Review Created!");

    // Redirect to the listing page after review submission
    res.redirect(`/listings/${listing._id}`);
    // res.send("sucess");
}


module.exports.destroyReview = async (req, res) => {
    let { id , reviewId } = req.params;

    // Remove the review reference from the Listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
}