const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){         //used to check the user is authenticated or not
      req.session.redirectUrl = req.originalUrl;    //original url give original url used for post-login page
      req.flash("error","you must be logged in to create listing");
      return res.redirect("/login");
    }
    next();
};


//middleware for post-login and pass this in user.js login route
module.exports.saveredirecturl = (req,res,next) =>{
if(!req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl;
}
next();
};


//middleware for authorisation and passed in listing.js
// module.exports.

// Middleware for error control
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((e1) => e1.message).join(","); // Show only messages
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};


//middleware for db error control
module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errorMsg = error.details.map((e1) => e1.message).join(","); // Show only messages
      throw new ExpressError(400, errorMsg);
    } else {
      next();
    }
 };
  