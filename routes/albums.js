var express = require("express");
var router  = express.Router();
var Album = require("../models/album");
var middleware = require("../middleware");

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

//SHOW PRIVATE COLLECTION
router.get("/user", middleware.isLoggedIn, function(req, res){
    Album.find({}, function(err, albums){
        if(err){
            console.log(err);
        } else {
            res.render("user",{albums: albums});
        }
    });
});

//CREATE - ADD ALBUMS TO DB
router.post("/", middleware.isLoggedIn, function(req, res){
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
            console.log(err);
            res.render("new");
        } else {
            res.redirect("/albums/user");
        }
    });    
});

//NEW - FORM ADD ALBUMS
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("new");
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
router.get("/:id/edit", middleware.checkAlbumOwnership, function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        res.render("edit", {album: foundAlbum});            
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkAlbumOwnership, function(req, res){
    Album.findByIdAndUpdate(req.params.id, req.body.album, function(err, foundAlbum){
        if(err){
            req.flash("error", "Failed to edit " + req.body.album.title);
            res.redirect("/albums/" + req.params.id);
        } else {
            req.flash("success", "Successfully edited " + req.body.album.title);
            res.redirect("/albums/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkAlbumOwnership, function(req, res){
    Album.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Album not deleted")
            res.redirect("/albums/user");
        } else {
            req.flash("success", "Album deleted successfully")
            res.redirect("/albums/user");
        }
    });
});

module.exports = router;