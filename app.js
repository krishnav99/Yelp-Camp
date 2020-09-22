var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	flash = require("connect-flash");
	methodOverride = require("method-override"),
	Seed = require("./seeds");

var port = process.env.PORT || 3000;

var Campground = require("./models/campground"),
	Comment   = require("./models/comment"),
	User = require("./models/user");
var campgroundsRoutes	= require("./routes/campgrounds"),
	commentsRoutes 		= require("./routes/comments"),
	indexRoutes			= require("./routes/index");
	
	
	//mongoose.connect('mongodb://localhost:27017/YelpCamp',
	mongoose.connect('mongodb+srv://Krishnav:aezakmi@yelpcamp.x4cg6.mongodb.net/YelpCamp?retryWrites=true&w=majority', {
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
	app.use(flash());

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
		res.locals.error = req.flash("error");
		res.locals.success = req.flash("success");
		next();
	})
	
	app.use(indexRoutes);
	app.use(campgroundsRoutes);
	app.use(commentsRoutes);

app.listen(port, function(){
    console.log("The Server is running");
})

