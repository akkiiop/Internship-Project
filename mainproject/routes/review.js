const express = require("express");
const router = express.Router({mergeParams:true});
//here we write megaparms:true because app.js not send id to routes
//if req is:  /listing/:id/reviews. then by using {megaparams:true} only we can get id into router and review.js file

const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const{validateReviews,isLoggedin} = require("../middleware.js");

// Middleware to check if the user is the owner of the listing
const isauthor = async (req, res, next) => {
  const { id,reviewid } = req.params;
  const review = await Review.findById(reviewid);
  // Authorization check
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to perform this action.");
    return res.redirect(`/listings/${id}`);
  }

  // Allow the user to proceed
  next();
};





//------------------------------------------------------------------------------------------------------------------------------
//For Reviews saving 
//------------------------------------------------------------------------------------------------------------------------------

    //by passing middleware as validatelisting
    router.post("/",validateReviews, isLoggedin, wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);   //getting listing by id
    let newreview = new Review(req.body.review);           //getting review content by form in that listing
    newreview.author = req.user._id;         //adding current user to author
    listing.reviews.push(newreview);              //adding this data to listings reviews
    
    await newreview.save();
    await listing.save();                         //saving both collections (models)
    req.flash("success","New Review Created")
    res.redirect(`/listings/${listing._id}`);
    }));
    
    
    //anyone can insert reviews on listing but only author of that review can delete their review 
    //so we need authorisation and we did it in middleware function above named as is author and passed in it
    //for deleting review
    router.delete("/:reviewid",isLoggedin,isauthor,wrapAsync(async (req, res) => {
      let {id , reviewid} = req.params;
    
      await Listing.findByIdAndUpdate(id,{$pull : {reviews: reviewid}})  //pull ais like set method which is used to delete and save update
      await Review.findByIdAndDelete(reviewid);
      req.flash("success","Review Deleted")
      res.redirect(`/listings/${id}`);
    
    }));

  
  
    
 module.exports = router;