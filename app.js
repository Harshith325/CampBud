var express = require("express"),
    app= express(),
    bodyParser=require("body-parser"),
    mongoose= require("mongoose"),
	flash   = require("connect-flash"),
	methodOverride= require("method-override"),
	passport= require("passport"),
	User= require("./modules/user.js"),
	LocalStrategy= require("passport-local"),
	passportLocalMongoose= require("passport-local-mongoose"),    
    Campground= require("./modules/campgrounds.js"),
    Comment= require("./modules/comments.js"),
    seedDB= require("./seeds.js");

var campgroundRoutes = require("./routes/campground.js");
var commentRoutes = require("./routes/comment.js");
var indexRoutes = require("./routes/index.js");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(flash());
app.use(require("express-session")({
	secret: "What is god",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB();

app.use(indexRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)

app.listen(3000,function(req,res){
	console.log("Server has started.");
})