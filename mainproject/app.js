const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require("connect-flash");


const passport = require("passport");
const localStratergy = require("passport-local");
const user = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userrouter = require("./routes/user.js");




//------------------------------------------------------------------------------------------------------------------------------
// MongoDB Setup
//------------------------------------------------------------------------------------------------------------------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/travelwebsite";



main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//------------------------------------------------------------------------------------------------------------------------------
// Setting up ejs-mate for layouts
//------------------------------------------------------------------------------------------------------------------------------
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//------------------------------------------------------------------------------------------------------------------------------
// Middleware
//------------------------------------------------------------------------------------------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



const sessionoptions={
  secret: "mysupersecretcode",
  resave:false,
  saveUninitialized : true,

  cookie : {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,    //cokkie expires after this time . consider example of login . if we login once then it will valid for some days . if we not login in betw that days we need to again login .
    maxAge: 1000*60*60*24*3,
    httpOnly: true,
  }

}


app.use(session(sessionoptions));
app.use(flash());



//always write this code exact below the session middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;       //this is to get information about user login in one session
  next();
})


// app.get("/demouser",async (req,res)=>{
//   let fakeuser = new user({
//     email: "abc@gmail.com",
//     username:"delta-s1"
//   });

//   let registereduser = await user.register(fakeuser,"helloWorld");    //registering new user (fakeuser) with password (helloworld)
//   res.send(registereduser);
// });

//using listing from router
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userrouter);



//------------------------------------------------------------------------------------------------------------------------------
// Home Route
//------------------------------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome to Wanderlust!");
});


//------------------------------------------------------------------------------------------------------------------------------
// Middleware to handle errors
//------------------------------------------------------------------------------------------------------------------------------
 //checks all routes by app.all("*")
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!!")); //sending error with status code and message 
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { message });
});

//------------------------------------------------------------------------------------------------------------------------------
// Start the server
//------------------------------------------------------------------------------------------------------------------------------
app.listen(8070, () => {
  console.log("Server is running on port 8080");
});






