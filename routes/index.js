var express = require("express"),
    router = express.Router(),
	passport = require("passport"),
	middleware = require("../middleware"),
    User    = require("../models/user");
    

router.get("/",function(req,res){
    res.render("home");
});

//NEW ROUTE FOR USER
router.get("/register", function(req, res){
	res.render("register");
})

//CREATE ROUTE FOR USER
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Succesfully Registered")
			res.redirect("/campgrounds");
		});
	});
})

//Login Form
router.get("/login", function(req, res){
	res.render("login");
})


router.post("/login", passport.authenticate("local", {
	successFlash: "Welcome!",
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){})

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success","Logged out");
	res.redirect("/campgrounds")
})

module.exports = router;



