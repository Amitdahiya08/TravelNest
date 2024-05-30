const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultLink = "https://images.unsplash.com/photo-1610513320995-1ad4bbf25e55?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
            default: "listingImage"
        },
        url: {
            type: String,
            default: defaultLink, 
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
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;  