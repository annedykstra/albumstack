var mongoose = require("mongoose");

var albumSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    image: String
});   

module.exports = mongoose.model("Album", albumSchema);