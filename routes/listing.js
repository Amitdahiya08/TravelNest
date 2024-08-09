const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage});

// index route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

router.route("/trending")
.get(wrapAsync(listingController.showTrending));
router.route("/room")
.get(wrapAsync(listingController.showRoom));
router.route("/city")
.get(wrapAsync(listingController.showCity));
router.route("/mountain")
.get(wrapAsync(listingController.showMountain));
router.route("/castle")
.get(wrapAsync(listingController.showCastle));
router.route("/pool")
.get(wrapAsync(listingController.showPool));
router.route("/camping")
.get(wrapAsync(listingController.showCamping));
router.route("/farm")
.get(wrapAsync(listingController.showFarms));
router.route("/arctic")
.get(wrapAsync(listingController.showArctic));
router.route("/beach")
.get(wrapAsync(listingController.showBeach));

// new route
router.route("/new")
.get(isLoggedIn, listingController.renderNewForm);

// show delete update routes
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing));

// edit route
router.route("/:id/edit")
.get(isLoggedIn,isOwner, wrapAsync(listingController.editListing));

module.exports = router;