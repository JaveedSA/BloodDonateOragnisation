require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "this is a scret of mine",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-javeed:javeed12@cluster0.rpiyd.mongodb.net/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});



mongoose.set("useCreateIndex", true);


const userSchema = new mongoose.Schema ({
  email: String,
  username: String,
  password: String,
  googleId: String,
  secret: String,
  form1: {
    firstname: String,
    lastname: String,
    numbers: Number,
    countryname: String,
    statename: String,
    districtname: String,
    bloodgr: String
  },
  form2: {
    firstname: String,
    lastname: String,
    numbers: Number,
    countryname: String,
    statename: String,
    districtname: String,
    bloodgr: String
  },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
// users.createIndex({
//   unique: true,
//   sparse: true,
//   background: true});

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {


    User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID_FB,
    clientSecret: process.env.CLIENT_SECRET_FB,
    callbackURL: "https://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/success",function(req,res){
  res.render("success");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile","email"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });


app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets1');
  });

  app.get("/login", function(req, res){
    res.render("login");
  });


app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});

app.post("/success",function(req,res){
  const fname = req.body.name1;
  const lname = req.body.name2;
  const num = req.body.number11;
  const country = req.body.state;
  const state1 = req.body.countrya;
  const district1 = req.body.district;
  const blood = req.body.blood1;

const formreg= new User({
  form1:{
  firstname: fname,
  lastname: lname,
  numbers: num,
  countryname: country,
  statename: state1,
  districtname: district1,
  bloodgr: blood
},
});
formreg.save();
res.render("secrets");

});


app.get("/secrets",function(req,res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});

app.get('/logout', function (req, res){
  // req.logout();
  // res.redirect("/");
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid');
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

app.get("/search",function(req,res){
  res.render("search")
});
app.post("/search", function(req,res){
  const countryname1= req.body.state;
  const statename1= req.body.countrya;
  const districtname1 = req.body.district;
  const bloodname1 = req.body.blood1;

  User.find({"form1.statename": statename1,"form1.districtname": districtname1,"form1.bloodgr":bloodname1},function(err,user){

    res.render("success",{posts:user});
  });
});


app.post("/", function(req, res){

});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});
app.get("/demo",function(req,res){
  res.render("demo");
});

app.get("/benifits",function(req,res){
  res.render("benifits");
});

app.get("/eligible",function(req,res){
  res.render("eligible");
});

app.get("/bloodtypes",function(req,res){
  res.render("bloodtypes");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
  console.log("This port is started Successful");
})
