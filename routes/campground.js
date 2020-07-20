var express= require("express");
var router= express.Router();
var Campground= require("../modules/campgrounds.js")
var middleware= require("../middleware")


router.get("/",function(req,res){
	Campground.find({},function(err,campground){
	if(err){
		console.log(err);
	}else
		res.render("campgrounds/campgrounds",{campgrounds:campground});

})
})
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new")
})

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err)
		}else{
				res.render("campgrounds/show", {campground:foundCampground});

		}
	})
})

router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var img=req.body.img;
	var price=req.body.price;
	var desc=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	var campground={name:name, img:img, price:price, description:desc, author:author};
	Campground.create(campground,function(err,newlyCreated){
		if(err){
			console.log(err)
		}else{
			req.flash("success","Successfully created Campground!")
			res.redirect("/campgrounds");
		}
	})
	
})

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/edit",{campground:foundCampground})
		}
	})
})

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,campground){
		if(err){
			res.redirect("/campgrounds")
		} else{
			req.flash("success","Campground edited!")
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds")
		}else{
			req.flash("success","Campground deleted!")
			res.redirect("/campgrounds")
		}
	})
})





module.exports = router;