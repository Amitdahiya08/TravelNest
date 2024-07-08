const express = require("express");
const mongoose = require("mongoose");

const mongoUrl = "mongodb://127.0.0.1:27017/travelNest";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema , reviewSchema }=require("./schema.js");
const Review = require("./models/review.js");
main()
    .then(() => {
        console.log("Database is connected");
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoUrl);
};

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

app.get("/", (req, res) => {
    res.send("Server is working ");
});
 
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

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
// index route
app.get("/listings", wrapAsync(async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
}));

// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// create route
app.post("/listings", validateListing, wrapAsync(async (req, res,next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// show route
app.get("/listings/:id", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

// edit route
app.get("/listings/:id/edit" , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// update route
app.put("/listings/:id",validateListing, wrapAsync( async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// reviews - Post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);

     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();

     console.log("review added");
     res.redirect(`/listings/${listing._id}`);
}));   

// delete review route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    // here pull operator removes the reviewId from review array of our listing
    await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
    // now deleting review from reviews collection
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

// custom Error Handler
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message}); 
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
});