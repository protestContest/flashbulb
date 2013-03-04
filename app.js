var express = require("express")
  , mongoose = require("mongoose")
  , credentials
  , passport = require("passport")
  , DropboxStrategy = require("passport-dropbox").Strategy
  , dropbox = require("dropbox")
  , mongoServer
  , port, hostname
  , app = express()
  , ac, uc
  ;


// Configuration Server
app.configure(function() {
    app.engine("jade", require("jade").__express);
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('less-middleware')({
      'src': __dirname + '/public' ,
      'compress': false
    }));
    app.use(express.static(__dirname + "/public"));
    app.use(express.cookieParser());
});

app.configure("development", function() {
    console.log("running in development environment");
    credentials = require("./credentials").development;
    app.locals.pretty = true;
    app.use(express.session({secret: "flashbulb"}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    port = 3000;
    hostname = "http://127.0.0.1:" + port;
});

app.configure("production", function() {
    var store;
    console.log("running in production environment");
    //credentials = require("./credentials").production;
    credentials = {
        "mongodb": {
            "url": process.env.MONGO_URL
        },
        "dropbox": {
            "appkey": process.env.DROPBOX_APPKEY,
            "secret": process.env.DROPBOX_SECRET
        }
    };
    app.use(express.session({secret: "bananahorsepancakes"}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.errorHandler()); 
    port = process.env.PORT || 8080;
    hostname = process.env.HOSTNAME;
});

dbClient = new dropbox.Client({
    key: credentials.dropbox.appkey,
    secret: credentials.dropbox.secret,
    sandbox: true
});

mongoServer = credentials.mongodb.url;

app.listen(port);
console.log("Express server listening on port %d", port);
mongoose.connect(mongoServer);

// Controllers
ac = require("./controllers/ApplicationController")(credentials);
uc = require("./controllers/UserController")(credentials);

// configure passport
passport.use(new DropboxStrategy({
    consumerKey: credentials.dropbox.appkey,
    consumerSecret: credentials.dropbox.secret,
    callbackURL: hostname + "/auth/dropbox/success"
}, ac.dbAuthenticate));

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Routes
app.get("/", ac.allFiles);
app.get("/all", [ac.auth], ac.allFiles);
app.get("/albums", [ac.auth], ac.albums);

app.get("/auth/dropbox", passport.authenticate("dropbox"));
app.get("/auth/dropbox/success", passport.authenticate("dropbox"),
        ac.loginSuccess);
app.get("/logout", ac.logout);

app.get("/file/:path", [ac.auth], ac.getFile);
app.get("/edit/:path", [ac.auth], ac.editFile);

app.get("/settings", [ac.auth], uc.settings);

app.get("/dbtest", ac.dbTest);
