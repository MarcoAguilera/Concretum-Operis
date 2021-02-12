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
const { emptyDirSync } = require('fs-extra');
const multer = require("multer");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const app = express();
const { convertToTimeZone } = require("date-fns-timezone"); 
const clean = require('./helper');
const helper = require('./helper');
const ejs = require("ejs");


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const autheToken = process.env.TWILIO_AITH_TOKEN;
const client = require('twilio')(accountSid, autheToken);

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
app.use(express.static(path.join(__dirname, "public")));
app.use("/project/:name", express.static(path.join(__dirname, "public")));
app.use("/edit/:id", express.static(path.join(__dirname, "public")));
app.use("/edit", express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MON_PASS2, {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});
// mongoose.connect("mongodb://localhost:27017/operisDB", {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
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
    data: Buffer,
    contentType: String,
    project: String
});

const projectSchema = new mongoose.Schema({
    name: String,
    homeImg: imageSchema
});

const requestSchema = new mongoose.Schema({
    customer: String,
    email: String,
    phone: String,
    message: String,
    date: {type: Date, default: Date.now}
});

const Image = mongoose.model("Image", imageSchema);
const Project = mongoose.model("Project", projectSchema);
const Request = mongoose.model("Request", requestSchema);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

app.get("/", function(req, res) {
    res.render("index", {user : req.isAuthenticated()});
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

app.get('/contact', function(req, res) {
    res.render("contact", {user : req.isAuthenticated()});
});

app.post('/contact', function(req, res) {
    const t = convertToTimeZone(new Date(), {timeZone: 'America/Los_Angeles'});

    const obj = new Request({ 
        customer: req.body.firstName + " " + req.body.lastName,
        email: req.body.email,
        phone: req.body.phoneNumber,
        message: req.body.text,
        date: t
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

app.get("/edit", function(req, res) {
    if(req.isAuthenticated()) {
        Project.find({}, (err, projects) => { 
            if (err) { 
                console.log(err); 
                res.redirect('/edit');
            } 
            else { 
                res.render('edit', {user : req.isAuthenticated(), projects: projects});
            } 
        }); 
    }
    else {
        res.redirect("/login");
    }
});

app.get("/edit/:id", function(req, res) {
    if(req.isAuthenticated()) {
        Project.findById(req.params.id, function(err, project) {
            if(err) {
                console.log(err);
                res.redirect("/edit");
            }
            else {
                Image.find({'project' : project._id.toString()}, function(err, imgs) {
                    if(err) {
                        console.log(err);
                        res.redirect('/edit');
                    }
                    else {
                        console.log("Images found: " + imgs.length);
                        res.render("edit-project", {user: req.isAuthenticated(), project: project, images: imgs});
                    }
                });
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/edit/:id", function(req, res) {
    if(req.isAuthenticated()) {
        Project.findByIdAndDelete(req.params.id, function(err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Successfully deleted project");

                Image.deleteMany({ project: req.params.id }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Delete images attached to project");
                    }
                });
            }
            res.redirect("/edit");
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/images/:id", function(req, res) {
    
    if(req.isAuthenticated()) {
        console.log(req.body);
        Image.deleteMany({_id: {
            $in: req.body.imgIds
        }}, function(err) {
            if(err) {
                console.log(err);
                res.redirect('/edit');
            }
            else {
                console.log("Delete Successful!");
                res.redirect("/edit/" + req.params.id);
            }
        });
    } 
    else {
        res.redirect("/login");
    }
});

app.post("/home/:id", upload.fields([{name: "newHomePhoto", maxCount: 1}]), function(req, res) {
    if(req.isAuthenticated()) {
        if (req.files.newHomePhoto) {
            console.log("New photo");
        }
        else {
            console.log("No photo!!!!!!!!!");
        }
        Project.findById(req.params.id, function (err, doc) {
            if (err) {
                console.log(err);
                res.redirect("/edit/" + req.params.id);
            }
            else {
                doc.name = req.body.projectName;
                if (req.files.newHomePhoto) {
                    doc.homeImg = {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.newHomePhoto[0].filename)), 
                        contentType: 'image/png',
                        project: req.body.projectName
                    }
                }
                doc.save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Update successful.");
                    }
                    res.redirect("/edit/" + req.params.id);
                });
            }
          });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/edit", upload.fields([{
    name: "homePhoto", maxCount: 1}, 
    {name: "projectPhotos", maxCount: 300}]), 
    function(req, res, next) {
    
    if(req.isAuthenticated()) {
        var obj = {
            name: req.body.projectName,
            homeImg: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.homePhoto[0].filename)), 
                contentType: 'image/png',
                project: req.body.projectName
            }
        };

        Project.create(obj, (err, proj) => {
            if(err) {
                console.log(err);
                res.redirect('/edit');
            }
            else {
                console.log("New Project Successfully created");

                var imgs = []
        
                for(i = 0; i < req.files.projectPhotos.length; i++) {
                    var img = {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.projectPhotos[i].filename)),
                        contentType: 'image/png',
                        project: proj._id
                    }
                    imgs.push(img);
                }
                Image.insertMany(imgs, function(err) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log("Images successfully created for project");
                    }
                    res.redirect('/edit');
                });
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

app.post("/add-new-images/:id", upload.fields([{name: "projectPhotos", maxCount: 300}]), function(req, res) {
    if (req.isAuthenticated()) {
        var imgs = [];

        for(i = 0; i < req.files.projectPhotos.length; i++) {
            var img = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.files.projectPhotos[i].filename)),
                contentType: 'image/png',
                project: req.params.id
            }
            imgs.push(img);
        }
        Image.insertMany(imgs, function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("Images successfully created for project");
            }
            res.redirect('/edit/' + req.params.id);
        });
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
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var date = convertToTimeZone(new Date(), {timeZone: 'America/Los_Angeles'});
        var startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay().toString();
        var daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        var x = new Array();

        for (var i = 0; i < (daysInMonth + 1); i++) {
            x.push(new Array());
        }
        
        console.log(x);

        Request.find({}, (err, requests) => {
            if (err) {
                console.log(err);
                res.redirect("/request");
            }
            else {
                requests.forEach(r => {
                    if (r.date.getDate() <= daysInMonth) {
                        x[r.date.getDate()].push(r);
                    }
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

app.get("/past-projects", function(req, res) {
    Project.find({}, (err, projects) => { 
        if (err) { 
            console.log(err); 
            res.redirect('/portfolio');
        } 
        else { 
            console.log("Found Projects");
            res.render('portfolio', {user : req.isAuthenticated(), projects: projects, helper: clean});
        } 
    }); 
});

app.get("/project/:name", function(req, res) {
    Project.findOne({'name' : helper.insertClean(req.params.name)}, function(err, project) {
        if(err) {
            console.log(err);
            res.redirect('/past-projects');
        } else {
            Image.find({'project' : project._id.toString()},{}, {skip: (10 * (1 - 1)), limit: 10}, function(err, imgs) {
                if(err) {
                    console.log(err);
                    res.redirect('/past-projects');
                }
                else {
                    console.log("Images found: " + imgs.length);
                    res.render("project", {user : req.isAuthenticated(), project: project, images: imgs});
                }
            });
        }        
    });
});

app.post("/more_imgs/:id/:page", function(req, res) {
    Project.findOne({'_id' : helper.insertClean(req.params.id)}, function(err, project) {
        if(err) {
            console.log(err);
            // res.redirect('/past-projects');
        } else {
            Image.find({'project' : project._id.toString()},{}, {skip: (10 * (req.params.page - 1)), limit: 10}, function(err, imgs) {
                if(err) {
                    console.log(err);
                    // res.redirect('/past-projects');
                }
                else {
                    console.log("Images found: " + imgs.length + ", Page: " + req.params.page);

                    if (imgs.length == 0) {
                        res.send({html: null});
                    }
                    else {
                        try {
                            var fixture_template = ejs.compile(fs.readFileSync("./views/show-images.ejs", 'utf8'));
                            var html = fixture_template({images: imgs});
        
                            res.send({html: html});
                        }
                        catch (err) {
                            res.redirect("/past-projects");
                        }
                    }
                }
            });
        }        
    });
});
// ******************************************
// Leave incase we want to make a new account
// ******************************************

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

// ******************************************
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ******************************************

app.use(function (req, res) {
    res.status(404).redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});