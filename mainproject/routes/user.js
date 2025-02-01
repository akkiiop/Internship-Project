const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware");

//------------------------------------------------------------------------------------------------------------------------------
//signup route
//------------------------------------------------------------------------------------------------------------------------------
router.get("/signup", (req, res) => {
    res.render("users/signup");
})

router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new user({ email, username });
        let registereduser = await user.register(newuser, password);    //registering new user (newuser) with password 
        console.log(registereduser);

// when user signup . then it performs automatic login user by using login method which takes 2 this.arguments, registerd/singupped user and callback
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");

            //post-login page code
            let redirecturl = res.locals.redirectUrl || "/listings";
            res.redirect(redirecturl);    
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }


}));



//------------------------------------------------------------------------------------------------------------------------------
//login route
//------------------------------------------------------------------------------------------------------------------------------
router.get("/login", (req, res) => {
    res.render("users/login");
})


//authenticate and there paramerts are get from documentation
router.post("/login",saveredirecturl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), async (req,res)=>{
req.flash("success","Welcome to Wanderlust");
res.redirect("/listings");
});



//------------------------------------------------------------------------------------------------------------------------------
//logout
//------------------------------------------------------------------------------------------------------------------------------
router.get("/logout",(req,res,next)=>{

    req.logout((err) => {    //req.logout() is passport method to logout
        if(err) {
           return next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/listings");
    });

});


module.exports = router;