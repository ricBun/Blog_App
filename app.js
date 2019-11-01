('use strict');
require('dotenv').config();

let express = require("express"),
    app     = express();

let bodyParser         = require("body-parser"),
    methodOverride     = require("method-override"),
    expressSanitizer   = require("express-sanitizer"),
    mongoose           = require("mongoose"),
    passport           = require("passport"),
    LocalStrategy      = require("passport-local"),
    Blog               = require("./models/blog"),

// requiring routes
    blogAppRoute       = require("./routes/index");


// APP CONFIG
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_URL}`, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => {
console.log('successfully connected to the database');
}).catch(err => {
console.log('error connecting to the database');
process.exit();
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// use route
app.use(blogAppRoute);

app.listen(3000, function(){
    console.log("BLOG APP STARTED");
});
