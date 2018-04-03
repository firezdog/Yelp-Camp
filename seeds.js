var mongoose = require("mongoose")
var Campground = require("./models/campgrounds")
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://picsum.photos/600/600/?image=280",
        description: "A resting place for clouds."
    },
    {
        name: "Cloud's Rise",
        image: "https://picsum.photos/600/600/?image=011",
        description: "Where the clouds go to rise."
    },
    {
        name: "Cloud's Butt",
        image: "https://picsum.photos/600/600/?image=100",
        description: "The butt of those clouds."
    }
]

function seedDB() {
    //remove campgrounds
    Campground.remove({}, function(err){
        if (err) {
            console.log(err);
        }
        console.log("Removed campgrounds!");
        
        //add a few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added campground.")
                    
                    //create comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there were Internet.", 
                            author: "Homer"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created comment for campground.")
                            }
                        });
                }
            });
        });
    });    
}

module.exports = seedDB;