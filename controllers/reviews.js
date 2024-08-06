const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review added");
    req.flash("success", "New Review added !");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id, reviewId} = req.params;
    // here pull operator removes the reviewId from review array of our listing
    await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
    // now deleting review from reviews collection
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully !");
    res.redirect(`/listings/${id}`);
 };