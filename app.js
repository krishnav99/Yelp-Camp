var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Seed = require("./seeds");

var Campground = require("./models/campground"),
	Comment   = require("./models/comment"),
	User = require("./models/user");

var campgroundsRoutes	= require("./routes/campgrounds"),
	commentsRoutes 		= require("./routes/comments"),
	indexRoutes			= require("./routes/index");
	
	
    mongoose.connect('mongodb://localhost:27017/YelpCamp', {
		useNewUrlParser: true,
		useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));
	
    app = express()
	//Seed();
	app.use(bodyParser.urlencoded({extended:true}));
	app.set("view engine", "ejs");
	app.use(express.static(__dirname + "/public"));
	app.use(methodOverride("_method"));
	
	//PASSPORT CONFIG
	app.use(require("express-session")({
		secret: "secret",
		resave: false,
		saveUninitialized: false
	}))
	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new localStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());
	
	app.use(function(req, res, next){
		res.locals.currentUser = req.user;
		next();
	})
	
	app.use(indexRoutes);
	app.use(campgroundsRoutes);
	app.use(commentsRoutes);

app.listen("3000", function(){
    console.log("The Server is running");
})

