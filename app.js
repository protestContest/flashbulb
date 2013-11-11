var express = require("express")
  , RedisStore = require("connect-redis")(express)
  , passport = require("passport")
  , DropboxStrategy = require("passport-dropbox").Strategy
  , FacebookStrategy = require("passport-facebook").Strategy
  , dropbox = require("dropbox")
  , port, hostname
  , appCon, userCon, albumCon, photoCon
  , app = express()
  , routes = require('./routes')
  , url = require("url");


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
  app.credentials = require("./credentials").development;
  app.locals.pretty = true;
  app.use(express.session({secret: "flashbulb", store: new RedisStore()}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.port = 3000;
  hostname = "http://127.0.0.1:" + app.port;
});

app.configure("production", function() {
  var store;

  app.credentials = require("./credentials").production;
  store = new RedisStore({
    "host": app.credentials.redis.host,
    "port": app.credentials.redis.port,
    "pass": app.credentials.redis.auth
  });
  app.use(express.session({"secret": "bananahorsepancakes", "store": store}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.errorHandler());
  app.port = process.env.PORT || 8080;
  hostname = process.env.HOSTNAME;
});

// Controllers
appCon = require("./controllers/ApplicationController")(app.credentials);
albumCon = require("./controllers/AlbumController")(app.credentials);
photoCon = require("./controllers/PhotoController")(app.credentials);

// configure passport
passport.use(new DropboxStrategy({
  consumerKey: app.credentials.dropbox.appkey,
  consumerSecret: app.credentials.dropbox.secret,
  callbackURL: hostname + "/login/success",
  passReqToCallback: true
}, appCon.dbAuthenticate));
passport.use(new FacebookStrategy({
  clientID: app.credentials.facebook.clientId,
  clientSecret: app.credentials.facebook.secret,
  callbackURL: hostname + "/auth/facebook/success",
  passReqToCallback: true
}, appCon.fbAuthenticate));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.start = function() {
  routes.setup(app, {
    passport: passport,
    application: appCon,
    photo: photoCon,
    album: albumCon
  });

  app.listen(app.port);
};

module.exports = app;

