const express = require("express");
const router = express.Router({mergeParams : true}); 
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema }=require("../schema.js");
const Review = require("../models/review.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
// reviews - Post route
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("review added");
    res.redirect(`/listings/${listing._id}`);
}));   

// delete review route

router.delete("/:reviewId", wrapAsync(async(req,res)=>{
   let {id, reviewId} = req.params;
   // here pull operator removes the reviewId from review array of our listing
   await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
   // now deleting review from reviews collection
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
}));

module.exports = router;
