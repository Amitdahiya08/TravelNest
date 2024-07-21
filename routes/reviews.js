const express = require("express");
const router = express.Router({mergeParams : true}); 
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js");
// reviews - Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review added");
    req.flash("success", "New Review added !");
    res.redirect(`/listings/${listing._id}`);
}));   

// delete review route

router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(async(req,res)=>{
   let {id, reviewId} = req.params;
   // here pull operator removes the reviewId from review array of our listing
   await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
   // now deleting review from reviews collection
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review Deleted Successfully !");
   res.redirect(`/listings/${id}`);
}));

module.exports = router;
