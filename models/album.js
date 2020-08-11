var mongoose = require("mongoose");

var albumSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});   

module.exports = mongoose.model("Album", albumSchema);