var credentials
  , Dropbox = require("dropbox")
  , FB = require("fb")
  , redis = require("redis")
  , developers = require("../developers")
  , User = require("../models/User")
  , dClient
  , rClient
  ;

// constructor
module.exports = function(creds) {
    credentials = creds;
    dClient = new Dropbox.Client({
        "key": credentials.dropbox.appkey,
        "secret": credentials.dropbox.secret,
        "sandbox": true
    });
    rClient = redis.createClient(credentials.redis.port,
                                 credentials.redis.host);
    return ApplicationController;
}

// public API
var ApplicationController = {
    "index": function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect("/home");
        } else {
            res.render("index");
        }
    },

    "login": function(req, res) {
        if (req.user) {
            req.session.user = req.user;
            res.redirect("/home");
        } else {
            res.redirect("/");
        }
    },

    "auth": function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/");
        }
    },

    "devAuth": function(req, res, next) {
        if (req.session.user && developers.indexOf(req.session.user.email) !== -1) {
            next();
        } else {
            res.send("Not auth'd");
        }
    },

    "logout": function(req, res) {
        req.logout();
        res.redirect("/");
    },

    "dbAuthenticate": function(req, token, tokenSecret, profile, done) {
        var dropbox = new Dropbox.Client({
            key: credentials.dropbox.appkey,
            secret: credentials.dropbox.secret,
            sandbox: true
        });
        dropbox.oauth.setToken(token, tokenSecret);
        rClient.hset("dropboxes", profile.id, JSON.stringify({
            "token": token,
            "secret": tokenSecret
        }));

        dropbox.getUserInfo(function(err, userInfo) {
            if (err) { return done(err); }

            User.findOrCreate({ dropboxId: profile.id }, userInfo,
                function(err, user) {
                    return done(err, user);
                }
            );
        });
    },
    
    "fbAuthenticate": function(req, token, tokenSecret, profile, done) {
        req.session.fbToken = token;
        req.session.facebook = { };
        req.session.facebook.id = profile.id;
        req.session.facebook.access_token = token;
        return done(null, req.user);
    },

    "fbUpload": function(req, res) {
        console.log("Uploading to Facebook");
        if (req.account && req.session.share) {

            // post to fb
            FB.setAccessToken(req.session.fbToken);
            FB.api("me/photos", "post", {
                "message": "Test post, please ignore",
                "source": loadFile(req.session.share.url),  // get actual file here, in a buffer
                "fileUpload": true,
                "enctype": "multipart/form-data"
            }, function(res) {
                if (!res || res.error) {
                    console.log(!res ? "fb upload error!" : res.error);
                }
            });

            res.redirect(req.session.share.returnURL);
        } else {
            res.redirect("/");
        }
    },

    "error": function(req, res) {
        res.render("error", {"error": req.body});
    },

    "help": function(req, res) {
        res.render("help");
    },
};

