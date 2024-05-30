const express = require("express");
const mongoose = require("mongoose");

const mongoUrl = "mongodb://127.0.0.1:27017/travelNest";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
main()
    .then(() => {
        console.log("Database is connected");
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoUrl);
};

const app = express();
app.listen(8080, () => {
    console.log("server is running on port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

app.get("/", (req, res) => {
    res.send("Server is working ");
});

// app.get("/testListing", async (req,res)=>{
//     let sample = new Listing({
//         title:"My villa",
//         description:"Feel like King",
//         price: 2000,
//         location: "Mumbai",
//         country : "India",
//     });
//     await sample.save();
//     console.log("sample was saved");
//     res.send("sample saved successfully");
// })

// index route
app.get("/listings", async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
});
// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});
// create route
app.post("/listings", async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
// show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});
// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});
// update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});
// delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
