var express    = require("express"),
    app        = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


var albums = [
    {name: "Rumours", artist: "Fleetwood Mac", genre: "Rock", image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"},
    {name: "Déjà Vu", artist: "Crosby, Stills, Nash & Young", genre: "Rock", image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Crosby%2C_Stills%2C_Nash_%26_Young_-_Deja_Vu.jpg/220px-Crosby%2C_Stills%2C_Nash_%26_Young_-_Deja_Vu.jpg"},
    {name: "The Joshua Tree", artist: "U2", genre: "Rock", image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/The_Joshua_Tree.png/220px-The_Joshua_Tree.png"},
];
   
app.get("/", function(req, res){
    res.render("landing");    
});

app.get("/albums", function(req, res){
    res.render("albums",{albums:albums});
});



app.listen(3000, function() {
    console.log('Server has started!');
});