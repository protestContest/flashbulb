var express = require("express")
  , mongoose = require("mongoose")
  , credentials
  , passport = require("passport")
  , DropboxStrategy = require("passport-dropbox").Strategy
  , mongoServer
  , port
  , app = express()
  , ac


// Configuration Server
app.configure(function() {
    app.engine("jade", require("jade").__express);
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + "/public"));
    app.use(express.cookieParser());
});

app.configure("development", function() {
    console.log("running in development environment");
    credentials = require("./credentials").development;
    app.use(express.session({secret: "flashbulb"}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    port = 3000;
});

app.configure("production", function() {
    var store;
    console.log("running in production environment");
    credentials = require("./credentials").production;
    app.use(app.router);
    app.use(express.errorHandler()); 
    port = 8080;
});

mongoServer = credentials.mongodb.url;

app.listen(port);
console.log("Express server listening on port %d", port);
mongoose.connect(mongoServer);

// Controllers
ac =  require("./controllers/ApplicationController")();

// configure passport
passport.use(new DropboxStrategy({
    consumerKey: credentials.dropbox.appkey,
    consumerSecret: credentials.dropbox.secret,
    callbackURL: "http://127.0.0.1:3000/auth/dropbox/success"
}, ac.dbAuthenticate));

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Routes
app.get("/", ac.home);
app.get("/auth/dropbox", passport.authenticate("dropbox"));
app.get("/auth/dropbox/success", passport.authenticate("dropbox"),
        ac.loginSuccess);

// user routes
app.get("/logout", ac.logout);
