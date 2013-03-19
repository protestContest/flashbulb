var express = require("express")
  , mongoose = require("mongoose")
  , credentials
  , passport = require("passport")
  , DropboxStrategy = require("passport-dropbox").Strategy
  , FacebookStrategy = require("passport-facebook").Strategy
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
    app.use(require("less-middleware")({
        "prefix": "/style",
        "src": __dirname + "/public/style/src" ,
        "dest": __dirname + "/public/style",
        "compress": false
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
        },
        "facebook": {
            "clientId": process.env.FACEBOOK_CLIENTID,
            "secret":   process.env.FACEBOOK_SECRET
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
appCon = require("./controllers/ApplicationController")(credentials);
userCon = require("./controllers/UserController")();
albumCon = require("./controllers/AlbumController")();
photoCon = require("./controllers/PhotoController")();

// configure passport
passport.use(new DropboxStrategy({
    consumerKey: credentials.dropbox.appkey,
    consumerSecret: credentials.dropbox.secret,
    callbackURL: hostname + "/auth/dropbox/success"
}, appCon.dbAuthenticate));
passport.use(new FacebookStrategy({
    clientID: credentials.facebook.clientId,
    clientSecret: credentials.facebook.secret,
    callbackURL: hostname + "/auth/facebook/success",
    passReqToCallback: true
}, appCon.fbAuthenticate));

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/* Routes */

// app
app.get("/", appCon.index);
app.get("/auth/dropbox", passport.authenticate("dropbox"));
app.get("/auth/dropbox/success", passport.authenticate("dropbox"),
        appCon.loginSuccess);
app.get("/auth/facebook", passport.authorize("facebook", {
    scope: "publish_stream",
    failureRedirect: "/fail"
}));
app.get("/auth/facebook/success", passport.authorize("facebook", { 
    failureRedirect: "/fail"
}), appCon.fbUpload);
app.get("/logout", appCon.logout);

// user
app.post("/user", userCon.create);
app.put("/user/:id", userCon.update);
app.delete("/user/:id", userCon.destroy);

// album
app.get("/album/:id", albumCon.view);
app.post("/album", albumCon.create);
app.put("/album/:id", albumCon.update);
app.delete("/album/:id", albumCon.destroy);

// photo
app.get("/photo/:id", photoCon.view);
app.post("/photo", photoCon.create);
app.put("/album/:id", photoCon.update);
app.delete("/album/:id", albumCon.destroy);

// shortcuts
app.get("/all", albumCon.viewAll);


/*
app.get("/", ac.index);
app.get("/all", ac.all);
app.get("/albums", ac.albums);
app.get("/all.json", [ac.auth], ac.allJson);
app.get("/albums.json", [ac.auth], ac.albumsJson);


app.get("/file/:path", [ac.auth], ac.getFile);
app.get("/edit/:path", [ac.auth], ac.editFile);
app.get("/public/file/:path", [ac.auth], ac.getPublicUrl);

app.get("/settings", [ac.auth], uc.settings);

app.get("/dbtest", ac.dbTest);
*/
