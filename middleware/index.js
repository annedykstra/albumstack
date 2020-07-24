var Album = require("../models/album");

var middlewareObj = {};

middlewareObj.checkAlbumOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Album.findById(req.params.id, function(err, foundAlbum){
            if(err || !foundAlbum){
                req.flash("error", "Album not found")
                res.redirect("back");
            } else {
                if(foundAlbum.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "No permission granted")
                    res.redirect("back");
                }     
            }
        });
    } else {
        req.flash("error", "Please log in first!")
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first!");
    res.redirect("/login");
}

module.exports = middlewareObj;