var bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    app            = express();
    
//APP CONFIG
mongoose.set('useFindAndModify', false);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/albumstack", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// SCHEMA SETUP
var albumSchema = new mongoose.Schema({
    title: String,
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
    var title = req.body.title;
    var artist = req.body.artist;
    var genre = req.body.genre;
    var image = req.body.image;
    var newAlbum = {name: title, artist: artist, genre: genre, image: image}
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

//SHOW - ALBUM INFO
app.get("/albums/:id", function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        if(err){
            console.log(err);
        } else {
            res.render("show", {album: foundAlbum});
        }
    });    
});

//EDIT ROUTE
app.get("/albums/:id/edit", function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        if(err){
            res.redirect("/albums");            
        } else {
            res.render("edit", {album: foundAlbum});
        }
    });
});

//UPDATE ROUTE
app.put("/albums/:id", function(req, res){
    Album.findByIdAndUpdate(req.params.id, req.body.album, function(err, foundAlbum){
        if(err){
            res.redirect("/albums");
        } else {
            res.redirect("/albums/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
app.delete("/albums/:id", function(req, res){
    Album.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/albums");
        }
    });
});

app.listen(3000, function() {
    console.log('Server has started!');
});