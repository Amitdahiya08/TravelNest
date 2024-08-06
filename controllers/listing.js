const Listing = require("../models/listing.js");

const ExpressError = require("../utils/ExpressError.js");
module.exports.index=async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
};

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing=async (req, res,next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing added !");
    res.redirect("/listings");
};

module.exports.showListing=async (req, res,next) => {
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
};

module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully got deleted !");
    res.redirect("/listings");
};