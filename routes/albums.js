var express = require("express");
var router  = express.Router();
var Album = require("../models/album");

//INDEX - SHOW COLLECTION
router.get("/", function(req, res){
    Album.find({}, function(err, albums){
        if(err){
            console.log(err);
        } else {
            res.render("index",{albums: albums});
        }
    });
});

//CREATE - ADD ALBUMS TO DB
router.post("/", isLoggedIn, function(req, res){
    var title = req.body.album.title;
    var artist = req.body.album.artist;
    var genre = req.body.album.genre;
    var image = req.body.album.image;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var createNewAlbum = {title: title, artist: artist, genre: genre, image: image, author: author};
    Album.create(createNewAlbum, function(err, newAlbum){
        if(err){
            res.render("/albums/new");
        } else {
            // console.log(createNewAlbum);
            res.redirect("/albums");
        }
    });    
});

//NEW - FORM ADD ALBUMS
router.get("/new", isLoggedIn, function(req, res){
    res.render("new.ejs");
});

//SHOW - ALBUM INFO
router.get("/:id", function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        if(err){
            console.log(err);
        } else {
            res.render("show", {album: foundAlbum});
        }
    });    
});

//EDIT ROUTE
router.get("/:id/edit", checkAlbumOwnership, function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        res.render("edit", {album: foundAlbum});            
    });
});

//UPDATE ROUTE
router.put("/:id", checkAlbumOwnership, function(req, res){
    Album.findByIdAndUpdate(req.params.id, req.body.album, function(err, foundAlbum){
        if(err){
            res.redirect("/albums");
        } else {
            res.redirect("/albums/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", checkAlbumOwnership, function(req, res){
    Album.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/albums");
        }
    });
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkAlbumOwnership(req, res, next){
    if(req.isAuthenticated()){
        Album.findById(req.params.id, function(err, foundAlbum){
            if(err){
                res.redirect("back");
            } else {
                if(foundAlbum.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }     
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;