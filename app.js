var express = require("express")
  , mongoose = require("mongoose")
  , credentials
  , RedisStore = require("connect-redis")(express)
  , passport = require("passport")
  , DropboxStrategy = require("passport-dropbox").Strategy
  , FacebookStrategy = require("passport-facebook").Strategy
  , dropbox = require("dropbox")
  , port, hostname
  , appCon, userCon, albumCon, photoCon
  , app = express();


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
    app.use(express.session({secret: "flashbulb", store: new RedisStore()}));
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
    app.use(express.session({secret: "bananahorsepancakes", store: new RedisStore()}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.errorHandler()); 
    port = process.env.PORT || 8080;
    hostname = process.env.HOSTNAME;
});

// Controllers
appCon = require("./controllers/ApplicationController")(credentials);
userCon = require("./controllers/UserController")(credentials);
albumCon = require("./controllers/AlbumController")();
photoCon = require("./controllers/PhotoController")();

// configure passport
passport.use(new DropboxStrategy({
    consumerKey: credentials.dropbox.appkey,
    consumerSecret: credentials.dropbox.secret,
    callbackURL: hostname + "/login/success",
    passReqToCallback: true
}, appCon.dbAuthenticate));
//passport.use(new FacebookStrategy({
//    clientID: credentials.facebook.clientId,
//    clientSecret: credentials.facebook.secret,
//    callbackURL: hostname + "/auth/facebook/success",
//    passReqToCallback: true
//}, appCon.fbAuthenticate));
//
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/* Routes */

// app
app.get("/", appCon.index);
app.get("/login", passport.authenticate("dropbox"));
app.get("/login/success", passport.authenticate("dropbox"), 
        appCon.login);

//app.get("/auth/facebook", passport.authorize("facebook", { //    scope: "publish_stream",
//    failureRedirect: "/fail"
//}));
//app.get("/auth/facebook/success", passport.authorize("facebook", { 
//    failureRedirect: "/fail"
//}), appCon.fbUpload);
app.get("/logout", appCon.logout);

// user
app.get("/home", appCon.auth, userCon.home);
app.get("/users", appCon.devAuth, userCon.all);
app.get("/users/new", appCon.devAuth, userCon.createForm);
app.get("/users/:id/edit", appCon.devAuth, userCon.updateForm);
app.get("/users/:id/albums/new", appCon.auth, userCon.createAlbumForm);
app.get("/users/:id", userCon.view);
app.post("/users", userCon.create);
app.post("/users/:id/albums", userCon.createAlbum);
app.put("/users/:id", userCon.update);
app.delete("/users/:id", userCon.destroy);

// album
app.get("/albums/:album", userCon.viewAlbum);
app.post("/albums", userCon.createAlbum);
app.delete("/albums/:album", userCon.deleteAlbum);

// photo
app.get("/photos/:album/:photo", userCon.getPhoto);
app.get("/photos/:photo", userCon.getPhoto);
app.post("/photos", photoCon.create);
app.put("/albums/:id", photoCon.update);
app.delete("/albums/:id", albumCon.destroy);

app.post("/move", userCon.movePhoto);

// shortcuts
//app.get("/all", photoCon.viewAll);


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

// make things go
mongoose.connect(credentials.mongodb.url);
app.listen(port);
console.log("Express server listening on port %d", port);

