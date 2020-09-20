var express = require("express"),
	router = express.Router(),
	middleware = require("../middleware"),
	Campground = require("../models/campground"),
    Comment = require("../models/comment"); 

//NEW ROUTE FOR COMMENT
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error", "Something went wrong!")
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
});

// CREATE ROUTE FOR COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error", "Something went wrong!")
			res.redirect("back");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				//saving user id to the comment
				comment.author.id = req.user._id;
				//saving usr name to the comment id
				comment.author.username = req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				res.redirect("/campgrounds/"+campground._id);
				});
		}

	});
});

//EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCanpground){
		if(err){
			req.flash("error", "Something went wrong!")
			res.redirect("back");
		}
		else{
			Comment.findById(req.params.comment_id, function(err,foundComment){
				if(err){
					res.redirect("back")
				}	
				else{
					res.render("comments/edit",{campground:foundCanpground, comment: foundComment});
				}
			})
		}
	})
});

//UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, newComment){
		if(err){
			res.redirect("back")
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

module.exports = router;