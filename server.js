//jshint esversion:6

// Heroku Website: https://quiet-ridge-87892.herokuapp.com/

// - Express to setup server
// - Https is used to make request to api's (example would be mongodb)
// - BodyParser is used to grab data from html file using the name variable

require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const fsExtra = require('fs-extra');
const multer = require("multer");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const { request } = require('http');
const app = express();
const sendMail = require(__dirname + '/public/src/mail.js');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const autheToken = process.env.TWILIO_AITH_TOKEN;
const client = require('twilio')(accountSid, autheToken);

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MON_PASS, {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});
// mongoose.connect("mongodb://localhost:27017/operisDB", {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const imageSchema = new mongoose.Schema({
    title: String,
    desc: String,
    img: {
        data: Buffer,
        contentType: String
    }
});

const requestSchema = new mongoose.Schema({
    customer: String,
    email: String,
    phone: String,
    message: String,
    date: {type: Date, default: Date.now}
});

const Image = mongoose.model("Image", imageSchema);

const Request = mongoose.model("Request", requestSchema);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/uploads/'))
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '-' + Date.now())
    }
});

var upload = multer({ storage: storage }); 

app.get("/", function(req, res) {
    Image.find({}, (err, items) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 
            res.render("index", {user : req.isAuthenticated(), images : items}); 
        } 
    });
});

app.post("/", function(req, res) {
    console.log("Post request received.");
    try {
        var name = req.body.name;
        var phone = req.body.phone;
        var body = `${name} would like to talk! Contact at : ${phone}`;
        client.messages.create ({
            body: body,
            from : '+18039024592',
            to : '8312102872'
        })
        .then(message => console.log(message))
        .catch(err => console.log(err));
    }
    catch(err) {
        console.log(err);
    }

    res.send('POST Handled');
});

app.get('/upload', (req, res) => { 
    if (req.isAuthenticated()) {
        Image.find({}, (err, items) => { 
            if (err) { 
                console.log(err); 
            } 
            else { 
                res.render('upload', { items: items,  user: req.isAuthenticated() }); 
            } 
        }); 
    }
    else {
        res.redirect("/login");
    }
}); 

app.get('/contact', function(req, res) {
    res.render("contact", {user : req.isAuthenticated()});
});

app.post('/contact', function(req, res) {
    
    function changeTimezone(date) {
        var invdate = new Date(date.toLocaleString('en-US'));
        var diff = date.getTime() - invdate.getTime();

        return new Date(date.getTime() - diff); // needs to substract
    }

    var here = new Date();
    var there = changeTimezone(here);

    console.log(there.toLocaleString());

    const obj = new Request({ 
        customer: req.body.firstName + " " + req.body.lastName,
        email: req.body.email,
        phone: req.body.phoneNumber,
        message: req.body.text,
        date: there
    });

    obj.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Successful request saved!");
        }
        res.redirect("contact");
    });
});

app.post('/new-image', upload.single('image'), (req, res, next) => { 
    if (req.isAuthenticated()) {
        var obj = { 
            title: req.body.name, 
            desc: req.body.desc, 
            img: { 
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
                contentType: 'image/png'
            } 
        } 
        Image.create(obj, (err, item) => { 
            if (err) { 
                console.log(err); 
                res.redirect("/upload")
            } 
            else { 
                console.log("Image added to database");
                res.redirect("/upload"); 
            }
        });
    }
    else {
        res.redirect("/login");
    }
}); 

app.post("/delete", function(req, res) {
    if (req.isAuthenticated()) {
        const imageID = req.body.img;
        Image.findByIdAndRemove(imageID, function(err) {
            if (!err) {
                console.log("Successfully deleted image!");
            }
            else {
                console.log(err);
            }
            res.redirect('/upload'); 
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/edit", function(req, res) {
    if (req.isAuthenticated()) {
        var img = req.body.img
        var title = req.body.edittitle;
        var desc = req.body.editdesc;

        Image.update(
            {_id: img },
            {$set: {title: title, desc: desc}},
            function(err) {
                if(!err) {
                    console.log("Successfully Updated!");
                }
                else {
                    console.log(err);
                }
                res.redirect("/upload");
            }
        );
    }
    else {
        res.redirect("/login");
    }
});

app.get("/admin-index", function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/request");
    }
    else {
        res.redirect("/login");
    }
});


app.get("/logout", function(req, res) {
    console.log("Logout route");
    req.logout();
    res.redirect("/");
});

app.get("/login", function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/upload');
    }
    else {
        res.render("login", {user : req.isAuthenticated()});
    }
});

app.post("/login", function(req, res) {
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    
    passport.authenticate('local', { successRedirect: "/admin-index", failureRedirect: "/login" })(req, res);
});

app.get("/request", function(req, res) {
    if (req.isAuthenticated()) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
        var date = new Date();
        date = new Date(date.toLocaleString('en-US'));

        var startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay().toString();
        var daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        var x = new Array(daysInMonth + 1);

        for (var i = 0; i < x.length; i++) {
            x[i] = new Array();
        }

        Request.find({}, (err, requests) => {
            if (err) {
                console.log(err);
                res.redirect("/request");
            }
            else {
                requests.forEach(r => {
                    x[r.date.getDate()].push(r);
                });

                res.render("request", {requests: x, daysInMonth: daysInMonth, startDay: startDay, currentDay: date.getDate(), month: months[date.getMonth()], year: date.getFullYear(), user: req.isAuthenticated()});
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/request", function(req, res) {
    if (req.isAuthenticated()) {
        console.log("ID: " + req.body.id);
        console.log("Day: " + req.body.day);

        Request.findByIdAndRemove(req.body.id, function(err) {
            if (!err) {
                Request.find({}, (err, requests) => {
                    if (err) {
                        console.log(err);
                        res.redirect("/request");
                    }
                    else {
                        var y = [];
                        requests.forEach(r => {
                            if (r.date.getDate() == req.body.day) {
                                y.push(r);
                            }
                        });
                        res.send(y);
                    }
                });
            }
            else {
                console.log(err);
                res.redirect('/request');
            } 
        });
    }
    else {
        res.redirect("/login");
    }
});

// app.get("/register", function(req, res) {
//     res.render("register");
// });

// app.post("/register", function(req, res) {

//     User.register({username: req.body.username}, req.body.password, function(err, user) {
//         if (err) {
//             res.redirect("/register");
//         }
//         else {
//             console.log("Register successful");
//         }
//     });
// });

app.use(function (req, res) {
    res.status(404).redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});