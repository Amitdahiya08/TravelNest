const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");

// index route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// new route
router.route("/new")
.get(isLoggedIn, listingController.renderNewForm);

// show delete update routes
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// edit route
router.route("/:id/edit")
.get(isLoggedIn,isOwner, wrapAsync(listingController.editListing));

module.exports = router;