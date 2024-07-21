const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
// index route
router.get("/", wrapAsync(async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
}));

// new route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// create route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req, res,next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing added !");
    res.redirect("/listings");
}));

// show route
router.get("/:id", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate :{path :"author"
        },
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// edit route
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// update route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync( async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully got deleted !");
    res.redirect("/listings");
}));

module.exports = router;