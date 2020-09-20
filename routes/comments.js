var express = require("express"),
    router = express.Router(),
	Campground = require("../models/campground"),
    Comment = require("../models/comment"); 

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
});

// post route of 
router.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
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
router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCanpground){
		if(err){
			console.log(err);
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
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
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
router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
			}
			else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect('back');
				}
			}
		})
	}
	else{
		res.redirect("back");
	}
}

module.exports = router;