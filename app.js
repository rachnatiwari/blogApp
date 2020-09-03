var express = require('express');
const app = express();
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//APP CONFIGRATION
// mongoose.connect("mongodb://localhost/blogApp",{useNewUrlParser:true});
mongoose.connect("mongodb://localhost:27017/blogApp", { useNewUrlParser: true, useUnifiedTopology: true });


app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE MODEL CONFIGRATION
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : 
        {
            type:Date , 
            default:Date.now
        }
});
var Blog = mongoose.model("Blog" , blogSchema);

// TESTING
// Blog.create({
//     title : "TEST BLOG",
//     image : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS7a_b5sOfcVNjBc3kZ14PigWYsNFuYDXLhFje-5ClZexMuoSkL&usqp=CAU",
//     body : "This is the test blog"
// },function(err,createdPost){
//     if(err)
//         console.log(err);
//     else{
//         console.log(createdPost);
//     }
// });

//RESTFUL ROUTES
app.get("/blogs" , function(req,res){
    Blog.find({} , function(err,allBlogs){
        if(err)
            console.log(err);
        else{
            res.render("index",{blogs : allBlogs});
        }
    })
});

app.get("/blogs/new" , function(req,res){
     res.render("new");
});

app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
            res.render("new");
        else{
             res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id" , function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog : foundBlog});
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog : foundBlog});
        }
    });
});

app.put("/blogs/:id" , function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err,updatedBlog){
        if(err)
            res.redirect("/blogs");
        else{
             res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id" , function(req,res){
    Blog.findOneAndRemove(req.params.id, function(err){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    })
})

app.get('/', function(req, res){
    res.redirect("/blogs");
});

app.listen(3000, function(){
    console.log(`Server is running at port 3000!!`)
});