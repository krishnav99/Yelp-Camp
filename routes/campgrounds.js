const { route } = require("./comments");

var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");
  
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

router.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("campgrounds/newform");
});

router.post("/campgrounds", isLoggedIn, function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author = { 
        id: req.user._id,
        username: req.user.username
    };
    var newCampground={name:name,image:image,description:description, author:author};
    Campground.create(newCampground,function(err,newcampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.user.username);
            console.log("new campground added to db");
            res.redirect("/campgrounds");
        }
    })
});


router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log("something went wrong");
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit",{campground : foundCampground});
         });
})

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            return res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds/"+req.params.id);
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err)
            return res.redirect("/campgrounds");
        res.redirect("/campgrounds");
    });
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err)
                return res.redirect("back");
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                res.redirect("back");
            }
        });
    }
    else{
        res.redirect("back");
    }     
}   

module.exports = router;


