var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing")
});

var campgrounds = [
    {
        name: "Salmon Creek",
        image: "https://acadiamagic.com/280x187/md-campground.jpg"
    },
    {
        name: "Geneva Glen",
        image: "https://www.marylmartin.com/wp-content/uploads/2016/01/343591.jpg"
    },
    {
        name: "Erana's Peace",
        image: "https://i.pinimg.com/originals/b3/66/17/b3661708c29006930fd15fb963864e39.jpg"
    },
]

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    campgrounds.push({name: req.body.name, image: req.body.image})
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new")
});

app.listen(3000, process.env.IP, function() {
    console.log("YelpCamp Server has started.")
})