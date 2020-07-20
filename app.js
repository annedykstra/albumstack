var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/albumstack", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// SCHEMA SETUP
var albumSchema = new mongoose.Schema({
    name: String,
    artist: String,
    genre: String,
    image: String
});   

var Album = mongoose.model("Album", albumSchema);
   
app.get("/", function(req, res){
    res.render("landing");    
});

//INDEX - SHOW COLLECTION
app.get("/albums", function(req, res){
    Album.find({}, function(err, albums){
        if(err){
            console.log(err);
        } else {
            res.render("index",{albums:albums});
        }
    });
});

//CREATE - ADD ALBUMS TO DB
app.post("/albums", function(req, res){
    var name = req.body.name;
    var artist = req.body.artist;
    var genre = req.body.genre;
    var image = req.body.image;
    var newAlbum = {name: name, artist: artist, genre: genre, image: image}
    Album.create(newAlbum, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/albums");
        }
    });    
});

//NEW - FORM TO ADD ALBUMS
app.get("/albums/new", function(req, res){
    res.render("new.ejs");
});



app.listen(3000, function() {
    console.log('Server has started!');
});