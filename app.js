var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");
    flash = require('connect-flash');

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");
seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "dasnichtsselbstnichtet",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//LANDING
app.get("/", function(req, res) {
    res.render("landing")
});

//REGISTER
app.get("/register", function(req, res){
    res.render("login/register");
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            res.render('login/register', {err: err});
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN
app.get("/login", function(req, res){
    res.render("login/login", {error: req.flash("error")});
});

app.post(
    "/login", 
    passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login",
        failureFlash: true
    }),
    function(req, res){
});

//INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    })
});

//CREATE
app.post("/campgrounds", function(req, res) {
    Campground.create(
        {
            name: req.body.name, 
            image: req.body.image,
            description: req.body.description
        }, 
        function(err, campground) {
        
            if(err) {
                console.log(err);
            }
            else {
                res.redirect("/campgrounds");
            }
        }
    )    
});

//NEW
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    });
});

//======================
// COMMENTS ROUTES
//======================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err)
        } else {
        res.render("comments/new", {campground: campground})
        }
    });
})

app.post("/campgrounds/:id/comments", function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    res.redirect('/campgrounds')
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                }
                //redirect
                res.redirect(`/campgrounds/${req.params.id}`)
            });
        }
    });
});

app.listen(8000, process.env.IP, function() {
    console.log("YelpCamp Server has started.");
});