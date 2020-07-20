var Campground= require("../modules/campgrounds")
var Comment= require("../modules/comments")

var middleware={};

middleware.checkCampgroundOwnership= function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back")
			} else{
                if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error","You dont have permission to do that to do that");
					res.redirect("back")
				}
			}
		})		
	} else{
		req.flash("error","You need to be logged in to do that");
		res.send("You need to log in")
	}
}

middleware.checkCommentOwnership= function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.id,function(err,foundComment){
			if(err){
				req.flash("error","Something went wromg");
				res.redirect("back")
			} else{
                if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error","You dont have permission to do that to do that");
					res.redirect("back")
				}
			}
		})		
	} else{
		req.flash("error","You need to be logged in to do that");
		res.send("You need to log in")
	}
}

middleware.isLoggedIn = function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}



module.exports= middleware;