var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");    
});

//SIGNUP FORM
router.get("/register", function(req, res){
    res.render("register");
});

//SIGNUP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.locals.error = req.flash("error");
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Signed in succesfully – let's put it together " + user.username + "!");
            res.redirect("/albums");
        });
    });
});

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/albums",
        failureRedirect: "/login"
    }), function(req, res){    
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You're logged out!")
    res.redirect("/albums");
});

module.exports = router;