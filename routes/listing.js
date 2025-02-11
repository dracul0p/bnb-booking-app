const express = require("express");
const router = express.Router();

// const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

// const { listingSchema } = require("../schema");

//models
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

// const { required } = require("joi");
// const { Cursor } = require("mongoose");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,
     //validateListing
     upload.single('listing[image]'),
  wrapAsync(listingController.createListing));
 
 
// create: get /listings/new -> form ->submit ---> post  /listings
//1. new route =>
  router.get("/new", isLoggedIn, listingController.renderNewForm);



router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    // validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

router.route("/:id");

//index route
// router.get("/", wrapAsync(listingController.index));


//show route
// router.get("/:id", wrapAsync(listingController.showListing));

//2. create =>

// router.post(
//   "/",
//   isLoggedIn,

//   wrapAsync(listingController.createListing)
// );

//Update : Edit & Update Route ==>
//1 .GET / listings/:id/edit ---> edit form ---> submit
//2. PUT /listings/:id

//1 Edit ==>
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//2  Update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
// validateListing

//   wrapAsync(listingController.updateListing)
// );

//Delete route ==>
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

module.exports = router;
