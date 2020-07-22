var bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    Album          = require("./models/album"),
    User           = require("./models/user"),
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

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "blablabla",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");    
});

//INDEX - SHOW COLLECTION
app.get("/albums", function(req, res){
    Album.find({}, function(err, albums){
        if(err){
            console.log(err);
        } else {
            res.render("index",{albums: albums});
        }
    });
});

//CREATE - ADD ALBUMS TO DB
app.post("/albums", isLoggedIn, function(req, res){
    Album.create(req.body.album, function(err, newAlbum){
        if(err){
            console.log(err);
        } else {
            res.redirect("/albums");
        }
    });    
});

//NEW - FORM TO ADD ALBUMS
app.get("/albums/new", isLoggedIn, function(req, res){
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
app.get("/albums/:id/edit", isLoggedIn, function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
        if(err){
            res.redirect("/albums");            
        } else {
            res.render("edit", {album: foundAlbum});
        }
    });
});

//UPDATE ROUTE
app.put("/albums/:id", isLoggedIn, function(req, res){
    Album.findByIdAndUpdate(req.params.id, req.body.album, function(err, foundAlbum){
        if(err){
            res.redirect("/albums");
        } else {
            res.redirect("/albums/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
app.delete("/albums/:id", isLoggedIn, function(req, res){
    Album.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/albums");
        }
    });
});

//AUTH ROUTES
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/albums");
        })
    });
});

//LOGIN FORM
app.get("/login", function(req, res){
    res.render("login");
});

//LOGIC ROUTES
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/albums",
        failureRedirect: "/login"
    }), function(req, res){    
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/albums");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



app.listen(3000, function() {
    console.log('Server has started!');
});