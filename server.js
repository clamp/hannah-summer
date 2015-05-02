var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var Spreadsheet = require('edit-google-spreadsheet');

var connection_string = '127.0.0.1:27017/hannah-summer';
var db = mongoose.connect(connection_string);

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    level: String
});

var UserModel = mongoose.model('UserModel', UserSchema);

passport.use(new LocalStrategy(function (username, password, done) {
    UserModel.findOne({username: username, password: password}, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

var checkAuth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

app.post("/login", passport.authenticate('local'), function (req, res) {
    var user = req.user;
    res.json(user);
});

app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : null);
});

app.post('/register', function (req, res) {
    UserModel.findOne({username: req.body.username}, function (err, user) {
        if (err) {
            return next(err);
        }

        if (user) {
            res.json(null);
            return;
        }

        var newUser = new UserModel(req.body);
        newUser.level = 'admin';
        newUser.save(function (err, user) {
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }

                res.json(user);
            });
        });
    });
});

app.get('/userList', function (req, res) {
    UserModel.find({}, function (err, users) {
        res.json(users);
    })
});

app.get('/getThisTime', function (req, res) {
    Spreadsheet.load({
            debug: true,
            spreadsheetName: 'Summer 1 Tour Schedule',
            worksheetName: 'List',
            oauth: {
                email: '7990401103-mdc5sq6lph4ojtdlvvuob3s3vlqglk7d@developer.gserviceaccount.com',
                keyFile: 'hannah-summer.pem'
            }
        },
        function sheetReady(err, spreadsheet) {

            spreadsheet.receive(function (err, rows, info) {
                if (err) throw err;

                for (var key in rows) {
                    var date = new Date(rows[key]['1'] + ' ' + rows[key]['2']);
                    var curDate = new Date();

                    var names = [];

                    if (date.getMonth() == curDate.getMonth() &&
                        date.getDate() == curDate.getDate() &&
                        date.getFullYear() == curDate.getFullYear() &&
                        date.getHours() == curDate.getHours() &&
                        rows[key]['4'] != 'Yes') {
                        names.push({ id: key, name: rows[key]['3'] });
                    }
                }

                res.send(names);
            });
        });
});

app.put('/checkIn/:id', function (req, res) {
    var id = req.params.id;
    Spreadsheet.load({
            debug: true,
            spreadsheetName: 'Summer 1 Tour Schedule',
            worksheetName: 'List',
            oauth: {
                email: '7990401103-mdc5sq6lph4ojtdlvvuob3s3vlqglk7d@developer.gserviceaccount.com',
                keyFile: 'hannah-summer.pem'
            }
        },
        function sheetReady(err, spreadsheet) {
            if(err) throw err;
            val = {};
            val[id] = { '4' : "Yes" };

            spreadsheet.add(val);

            spreadsheet.send(function(err) {
                if(err) throw err;
                res.send(true);
            });
        });
});

var server_port = 3030;
app.listen(server_port);