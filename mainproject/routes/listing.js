
const express = require("express");
const router = express.Router();

// Import necessary modules
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, validateListing } = require("../middleware.js");

// Middleware to check if the user is the owner of the listing
const isowner = async (req, res, next) => {
  const { id } = req.params;
   // we are adding authorization here to protect our update api
  // Fetch the listing and populate the owner field
  const listing = await Listing.findById(id).populate("owner");

  // Check if the listing exists
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Authorization check
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to perform this action.");
    return res.redirect("/listings");
  }

  // Allow the user to proceed
  next();
};

//------------------------------------------------------------------------------------------------------------------------------
// Index Route
//------------------------------------------------------------------------------------------------------------------------------
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

//------------------------------------------------------------------------------------------------------------------------------
// New Route
//------------------------------------------------------------------------------------------------------------------------------
router.get("/new", isLoggedin, (req, res) => {
  res.render("listings/new");
});

//------------------------------------------------------------------------------------------------------------------------------
// Show Route
//------------------------------------------------------------------------------------------------------------------------------
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  // Fetch listing and populate reviews and owner
  const listing = await Listing.findById(id)
  .populate({path:"reviews",
    populate:{                //nested populate method--
      path:"author",
    },
  })
  .populate("owner");   //getting owners data means user data 

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
}));

//------------------------------------------------------------------------------------------------------------------------------
// Create Route
//------------------------------------------------------------------------------------------------------------------------------
router.post("/", isLoggedin, validateListing, wrapAsync(async (req, res) => {
  const listingData = req.body.listing;

  // Handle single image case
  if (typeof listingData.image === "string") {
    listingData.image = {
      filename: "user-uploaded",
      url: listingData.image,
    };
  }

  // Set the owner of the new listing
  const newListing = new Listing(listingData);
  newListing.owner = req.user._id;

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}));

//------------------------------------------------------------------------------------------------------------------------------
// Edit Route
//------------------------------------------------------------------------------------------------------------------------------
router.get("/:id/edit", isLoggedin, isowner, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
}));

//------------------------------------------------------------------------------------------------------------------------------
// Update Route
//------------------------------------------------------------------------------------------------------------------------------
router.put("/:id", isLoggedin, isowner, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  // Handle single image case
  if (typeof updatedData.image === "string") {
    updatedData.image = {
      filename: "user-uploaded",
      url: updatedData.image,
    };
  }

  const listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

  if (!listing) {
    req.flash("error", "Failed to update the listing.");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));

//------------------------------------------------------------------------------------------------------------------------------
// Delete Route
//------------------------------------------------------------------------------------------------------------------------------
router.delete("/:id", isLoggedin, isowner, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndDelete(id);

  if (!listing) {
    req.flash("error", "Failed to delete the listing.");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

module.exports = router;













//------------------------------------------------------------------------------------------------------------------------------
//router:
//------------------------------------------------------------------------------------------------------------------------------
//use to simplify app.js
//cut the listing routes and paste here
//get all the nessasary require functions and change paths according to this file
//replace app.get with router.get and router.port etc...
//export it and import in app.js as:  const listing = require("./routes/listing.js")
//use it in app.js as app.use("/listings",listing)
//remove "/listing" path because it is comman in all below paths and is written in app.use("/listings");






  //to check user is autheticated or not
  
  // New Route
  // router.get("/new", (req, res) => {
  //   if(!req.isAuthenticated()){         //used to check the user is authenticated or not
  //     req.flash("error","you must be logged in to create listing");
  //     return res.redirect("/login");
  //   }
  //   console.log(req.user)   //get user details if user is logged in
  //   res.render("listings/new");
  // });

  //this above code is replace or simplified by using middleware defined in middleware.js


  //  //------------------------------------------------------------------------------------------------------------------------------
  // // Update Route:  this is code for authorisation .. this code is replaced using middleware defined in middleware.js and named as isowner
  // //------------------------------------------------------------------------------------------------------------------------------
  // router.put("/:id",isLoggedin, wrapAsync(async (req, res) => {
  //   const { id } = req.params;
  //   const updatedData = req.body.listing;
    
  //   if (typeof updatedData.image === "string") {
  //     updatedData.image = {
  //       filename: "user-uploaded",
  //       url: updatedData.image,
  //     };
  //   }
  //   // we are adding authorization here to protect our update api
  //   let listing = await Listing.findById(id);

  //   if(!listing.owner._id.equals(res.locals.currUser._id)){
  //     req.flash("error","you dont have permission to edit");
  //     return res.redirect(`/listings/${id}`);
  //   }


  //   await Listing.findByIdAndUpdate(id, updatedData);
  //   res.redirect(`/listings/${id}`);
  // }));
  
  























