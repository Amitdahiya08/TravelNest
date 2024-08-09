const Listing = require("../models/listing.js");
// index route
module.exports.index=async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
};
// trending
module.exports.showTrending=async (req, res) => {
    const AllListings = await Listing.find({categories:"Trending"});
    res.render("listings/index.ejs", { AllListings });
};
// room
module.exports.showRoom=async (req, res) => {
    const AllListings = await Listing.find({categories:"Room"});
    res.render("listings/index.ejs", { AllListings });
};
// Iconic cities
module.exports.showCity=async (req, res) => {
    const AllListings = await Listing.find({categories:"Iconic-Cities"});
    res.render("listings/index.ejs", { AllListings });
};
// Mountains
module.exports.showMountain=async (req, res) => {
    const AllListings = await Listing.find({categories:"Mountains"});
    res.render("listings/index.ejs", { AllListings });
};
// castles
module.exports.showCastle=async (req, res) => {
    const AllListings = await Listing.find({categories:"Castles"});
    res.render("listings/index.ejs", { AllListings });
};
// Amazing pools
module.exports.showPool=async (req, res) => {
    const AllListings = await Listing.find({categories:"Amazing-Pools"});
    res.render("listings/index.ejs", { AllListings });
};
// camping
module.exports.showCamping=async (req, res) => {
    const AllListings = await Listing.find({categories:"Camping"});
    res.render("listings/index.ejs", { AllListings });
};
// show farms
module.exports.showFarms=async (req, res) => {
    const AllListings = await Listing.find({categories:"Farms"});
    res.render("listings/index.ejs", { AllListings });
};
// show arctic
module.exports.showArctic=async (req, res) => {
    const AllListings = await Listing.find({categories:"Arctic"});
    res.render("listings/index.ejs", { AllListings });
};
// show beaches
module.exports.showBeach=async (req, res) => {
    const AllListings = await Listing.find({categories:"Beach"});
    res.render("listings/index.ejs", { AllListings });
};


module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing=async (req, res,next) => {
    let url = req.file.path;
    let filename= req.file.filename; 
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
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
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename= req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully got deleted !");
    res.redirect("/listings");
};