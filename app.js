require("dotenv").config();

var $              = require("jquery");
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    Album          = require("./models/album"),
    User           = require("./models/user"),
    express        = require("express"),
    app            = express();

//REQUIRING ROUTES
var albumRoutes = require("./routes/albums"),
    indexRoutes = require("./routes/index");   

//APP CONFIG
mongoose.set('useFindAndModify', false);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/albumstack", {useNewUrlParser: true});
// mongoose.connect(process.env.db_url, {
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true
// }).then(() => {
//     console.log("Connected to database!");
// }).catch(err => {
//     console.log(err.message);
// });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "airspeed velocity of unladen swallow",
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/albums", albumRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server has started!');
});