var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose =   require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("campground", campgroundSchema);

// Campground.create (
//     {
//         name: "Salmon Creek",
//         image: "https://acadiamagic.com/280x187/md-campground.jpg"
//     }, 
//     function(err, campground) {
//         if(err) {
//             console.log(err);
//         }
//         else {
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     }
// );

// Campground.create (
//     {
//         name: "Geneva Glen",
//         image: "https://www.marylmartin.com/wp-content/uploads/2016/01/343591.jpg"
//     },
//     function(err, campground) {
//         if(err) {
//             console.log(err);
//         }
//         else {
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     }
// );

// Campground.create (
//     {
//         name: "Erana's Peace",
//         image: "https://i.pinimg.com/originals/b3/66/17/b3661708c29006930fd15fb963864e39.jpg"
//     },
//     function(err, campground) {
//         if(err) {
//             console.log(err);
//         }
//         else {
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     }
// )

app.get("/", function(req, res) {
    res.render("landing")
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds", {campgrounds: campgrounds});
        }
    })
});

app.post("/campgrounds", function(req, res) {
    Campground.create(
        {
            name: req.body.name, 
            image: req.body.image
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

app.get("/campgrounds/new", function(req, res) {
    res.render("new")
});

app.listen(3000, process.env.IP, function() {
    console.log("YelpCamp Server has started.")
})