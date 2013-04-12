var express = require("express")
  , pjax = require("express-pjax")
  , mongoose = require("mongoose")
  , credentials
  , RedisStore = require("connect-redis")(express)
  , passport = require("passport")
  , DropboxStrategy = require("passport-dropbox").Strategy
  , FacebookStrategy = require("passport-facebook").Strategy
  , dropbox = require("dropbox")
  , port, hostname
  , appCon, userCon, albumCon, photoCon
  , app = express()
  , url = require("url");


// Configuration Server
app.configure(function() {
    app.engine("jade", require("jade").__express);
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(pjax());
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
    var store,
        redisURL = url.parse(process.env.REDISCLOUD_URL);
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
        },
        "redis": {
            "host": redisURL.hostname,
            "port": redisURL.port,
            "auth": redisURL.auth.split(":")[1]
        }
    };
    store = new RedisStore({
        "host": credentials.redis.host,
        "port": credentials.redis.port,
        "pass": credentials.redis.auth
    });
    app.use(express.session({"secret": "bananahorsepancakes", "store": store}));
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
albumCon = require("./controllers/AlbumController")(credentials);
photoCon = require("./controllers/PhotoController")(credentials);

// configure passport
passport.use(new DropboxStrategy({
    consumerKey: credentials.dropbox.appkey,
    consumerSecret: credentials.dropbox.secret,
    callbackURL: hostname + "/login/success",
    passReqToCallback: true
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
app.get("/error", appCon.error);
app.get("/login", passport.authenticate("dropbox"));
app.get("/login/success", passport.authenticate("dropbox"), 
        appCon.login);

app.get("/auth/facebook", passport.authorize("facebook", { 
    scope: "publish_stream",
    failureRedirect: "/error"
}));
app.get("/auth/facebook/success", passport.authorize("facebook", { 
    failureRedirect: "/error"
}), appCon.fbUpload);
app.get("/logout", appCon.logout);

// user
app.get("/home", appCon.auth, userCon.home);
app.get("/users", appCon.devAuth, userCon.all);
app.get("/users/new", appCon.devAuth, userCon.createForm);
app.get("/users/:id/edit", appCon.devAuth, userCon.updateForm);

//app.get("/users/:id/albums/new", appCon.auth, userCon.createAlbumForm);
app.get("/users/:id", userCon.view);
app.post("/users", appCon.devAuth, userCon.create);
app.put("/users/:id", appCon.devAuth, userCon.update);
app.delete("/users/:id", appCon.devAuth, userCon.destroy);

// album
app.get("/albums", appCon.auth, albumCon.all);
app.get("/albums/new", appCon.auth, albumCon.createForm);
app.get("/albums/:album", appCon.auth, albumCon.view);
app.post("/albums", appCon.auth, albumCon.create);
app.delete("/albums/:album", appCon.auth, albumCon.destroy);

// photo
app.get("/photos/all", appCon.auth, photoCon.all);
app.get("/photos/:album/:photo", appCon.auth, photoCon.get);
app.get("/photos/:photo", appCon.auth, photoCon.get);
app.post("/photos", appCon.auth, photoCon.upload);
app.post("/photos/:album", appCon.auth, photoCon.upload);
app.post("/move", appCon.auth, photoCon.move);

app.get("/public/photos/:path", appCon.auth, photoCon.getPublicUrl);
app.get("/ajax/allphotos", appCon.auth, photoCon.allContent);

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

app.get("/settings", [ac.auth], uc.settings);

app.get("/dbtest", ac.dbTest);
*/

// make things go
mongoose.connect(credentials.mongodb.url);
app.listen(port);
console.log("Express server listening on port %d", port);

