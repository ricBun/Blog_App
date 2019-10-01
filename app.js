var bodyParser    = require("body-parser"),
methodOverride  = require("method-override"),
expressSanitizer  = require("express-sanitizer"),
express                = require("express"),
mongoose            = require("mongoose"),
app                       = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://www.discoverlosangeles.com/sites/default/files/styles/hero/public/images/2019-01/Hermosa%20Beach%20Pier%20sunset.jpg?itok=9x82CPJg",
//     body:"This is a beautiful sunset!",
// });

// RESTFUL ROUTES

app.get("/", function(req, res){
   res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
            res.render("index", {blogs: blogs});
       }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req,res){
   res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req,res){
   // create blog
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err,newBlog) {
       if(err){
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
   })
   // then, redirect to the index
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.render("show", {blog: foundBlog});
      }
   });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
            res.render("edit", {blog: foundBlog});
       }
   }) ;
});

// UPDATE ROUTE
app.put("/blogs/:id/", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

   // Blog.findById(req.params.id, function(err, foundBlog){
   //     if(err){
   //         res.redirect("/blogs");
   //     } else {
   //          res.render("edit", {blog: foundBlog});
   //     }
   // }) ;
// });

app.listen(4000, function(){
    console.log("BLOG APP STARTED");
});
// title
// image
// body
// created
