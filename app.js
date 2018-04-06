var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comment")
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res) {
    res.render("landing")
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