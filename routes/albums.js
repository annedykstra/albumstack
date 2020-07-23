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
    Album.create(req.body.album, function(err, newAlbum){
        if(err){
            console.log(err);
        } else {
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
router.get("/:id/edit", isLoggedIn, function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        if(err){
            res.redirect("/albums");            
        } else {
            res.render("edit", {album: foundAlbum});
        }
    });
});

//UPDATE ROUTE
router.put("/:id", isLoggedIn, function(req, res){
    Album.findByIdAndUpdate(req.params.id, req.body.album, function(err, foundAlbum){
        if(err){
            res.redirect("/albums");
        } else {
            res.redirect("/albums/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", isLoggedIn, function(req, res){
    Album.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
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

module.exports = router;