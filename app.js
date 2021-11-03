//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin-akshay:Bops2gamer@cluster0.yf5xd.mongodb.net/blogDB?retryWrites=true&w=majority"
); //connecting to the mongoDB server

const homeStartingContent = //default content for home.ejs
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = //content for about.ejs
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = //content for contact.ejs
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express(); //storing express function in a constant

const postSchema = new mongoose.Schema({
  postTitle: String,
  postBody: String,
}); //Schema (layout) for the post

const Post = mongoose.model("Post", postSchema); //collection model Post

app.set("view engine", "ejs"); //to render ejs documents (files stored in views folder)

app.use(express.urlencoded({ extended: true })); //to get values from html/ejs pages
app.use(express.static("public")); //to use public directory for css and other scripts

app.get("/", function (req, res) {
  //root directory

  Post.find({}, function (err, postsFound) {
    //.find query to find all objects for the database

    if (err) {
      console.log(err);
    } else {
      console.log("All posts found!!");
    }

    res.render("home.ejs", {
      //rendering found objects to home.ejs using "view engine"
      homeContentEJS: homeStartingContent, //parsing variables to be used in ejs file
      postsFoundEJS: postsFound,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose.ejs"); //rendering "compose.ejs" when URL "/compose"
});

app.get("/posts/:postID", function (req, res) {
  //onlick "Read More", searching for _id and storing its value in :post ID

  var requestedPostID = req.params.postID; //further storing postID in a var

  Post.findOne({ _id: requestedPostID }, function (err, post) {
    //if postID = found then rendering post.ejs with postTitle and postBody
    res.render("post.ejs", {
      postTitleEJS: post.postTitle, //postTitleEJS var for "post.ejs" file
      postBodyEJS: post.postBody, //postBodyEJS var for "post.ejs" file
    });
  });
});

app.post("/compose", function (req, res) {
  //after publishing info on "/compose"
  var post = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postTextArea,
  }); //storing info in Schema format

  post.save(); //pushing info to the connected datbase
  console.log("Post Added to DB");

  res.redirect("/"); //redirecting user to the root directory
});

app.get("/about", function (req, res) {
  res.render("about.ejs", { aboutContentEJS: aboutContent }); //rednering about.ejs
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs", { contactContentEJS: contactContent }); //rednering conatct.ejs
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000"); //opening server at port 3000
});
