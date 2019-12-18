//jshint esversion:6
//dakhkdas
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String
  });


// use encryption
//userSchema.plugin(encrypt, {secret: process.env.SECRET});

const User = new mongoose.model("User", userSchema);


/**************************************** Home ***********************************************/
app.route("/")

.get(
  function(req, res) {
    res.render("home");
  }
);


/**************************************** Regitser ***********************************************/

app.route("/register")

.get(
  function(req, res) {
    res.render("register");
  }
)

.post(function(req, res) {
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      }
      else{
        console.log(err);
      }
    });
  });
});





/**************************************** Login ***********************************************/
app.route("/login")

.get(
  function(req, res) {
    res.render("login");
  }
)

.post(function(req, res) {
  User.findOne({email: req.body.username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    }
    else {
      bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
        if (err) {
          console.log(err);
        }
        else {
          if (result === true) {
            res.render("secrets");
          }
        }
      });
    }
  });

});

/**************************************** Log Uut ***********************************************/


app.route("/logout")

.get(function(req, res) {
  res.render("home");
});



/**************************************** Submit ***********************************************/


app.route("/submit")

.get(function(req, res) {
  res.render("submit");
})


.post(function(req, res) {
  // deal with new secrets
  res.render("secrets");
});



/**************************************** Run Server ***********************************************/

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
