const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const defaultLink = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String,
            default: "listingImage",
            set: (v) => v === "" ? "listingImage": v,
        },
        url: {
            type: String,
            default: defaultLink, 
            set: (v) => v === "" ? defaultLink: v,
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    }, 
    country: {
        type: String,
        required: true
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    categories : {
        type: [String],
        enum : ["Trending","Room","Iconic-Cities","Mountains","Castles","Amazing-Pools","Camping","Farms","Arctic","Beach"]
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;  