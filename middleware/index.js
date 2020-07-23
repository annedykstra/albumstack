var Album = require("../models/album");

var middlewareObj = {};

middlewareObj.checkAlbumOwnership = function(req, res, next){
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

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;