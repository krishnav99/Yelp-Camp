const { route } = require("./comments");

var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Campground = require("../models/campground");

//INDEX ROUTE
router.get("/campgrounds",function(req,res){
    // get Campground data from db
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("something went wrong");
            console.log(err);
        }
        else{
            res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
        }
    });
    
})

//NEW ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/newform");
});

//CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author = { 
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = req.body.campground;
    newCampground.author = {id: req.user._id, username: req.user.username};
    Campground.create(newCampground,function(err,newcampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.user.username);
            console.log("new campground added to db");
            req.flash("success","Campground Created!")
            res.redirect("/campgrounds");
        }
    })
});

//SHOW ROUTE
router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit",{campground : foundCampground});
         });
})

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "There was an error")
            return res.redirect("/campgrounds");
        }
        req.flash("success", "Campground edited");
        res.redirect("/campgrounds/"+req.params.id);
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err)
            return res.redirect("/campgrounds");
        req.flash("success","Campground deleted!");
        res.redirect("/campgrounds");
    });
})

module.exports = router;



