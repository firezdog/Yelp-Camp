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
    image: String,
    description: String
});

var Campground = mongoose.model("campground", campgroundSchema);

// Campground.create (
//     {
//         name: "Salmon Creek",
//         image: "https://acadiamagic.com/280x187/md-campground.jpg",
//         description: "This is a creek filled with salmon. Good sushi."
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
//         image: "https://www.marylmartin.com/wp-content/uploads/2016/01/343591.jpg",
//         description: "Geneva, we love you, / Your wonderful fragrance of pine..."
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
//         image: "https://i.pinimg.com/originals/b3/66/17/b3661708c29006930fd15fb963864e39.jpg",
//         description: "The meadow lies covered with a blanket of flowers, unusual for this early in the spring. It is warm, even though surrounded by the late snows of winter. The air has the fresh, clean scent of the mountains, accompanied by numerous perfume-like fragrances. A large, carved stone lies flat on the ground. You feel as though someone gentle were watching over you. You feel that you are safe here." 
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

//INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        }
        else {
            res.render("index", {campgrounds: campgrounds});
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
    res.render("new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            res.render("show", {campground: foundCampground})
        }
    });
});

app.listen(3000, process.env.IP, function() {
    console.log("YelpCamp Server has started.");
});