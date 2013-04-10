var Dropbox = require("dropbox")
  , crypto = require("crypto")
  , https = require("https")
  , FB = require("fb")
  , jade = require("jade")
  , redis = require("redis")
  , developers = require("../developers")
  , Watcher = require("../dropboxWatcher")
  ;

var ApplicationController = function(credentials) {
    var User,
        dClient,
        rClient = redis.createClient(credentials.redis.port,
                    credentials.redis.host);

    rClient.auth(credentials.redis.auth);

    if (!(this instanceof ApplicationController)) {
        return new ApplicationController(credentials);
    }

    User = require("../models/User");
    dClient = new Dropbox.Client({
        key: credentials.dropbox.appkey,
        secret: credentials.dropbox.secret,
        sandbox: true
    });

    this.index = function(req, res) {
        if (req.session.user) {
            res.redirect("/home");
        } else {
            res.render("index");
        }
    };

    this.dbAuthenticate = function(req, token, tokenSecret, profile, done) {
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
    };

    this.login = function(req, res) {
        if (req.user) {
            req.session.user = req.user;
            res.redirect("/home");
        } else {
            res.redirect("/");
        }
    };

    this.auth = function(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.redirect("/");
        }
    };

    this.devAuth = function(req, res, next) {
        if (req.session.user && developers.indexOf(req.session.user.email) !== -1) {
            next();
        } else {
            res.send("Not auth'd");
        }
    };

    this.logout = function(req, res) {

        req.logout();
        delete req.user;
        delete req.account;
        delete req.session;
        res.redirect("/");
    };

/***************************

    this.fbAuthenticate = function(req, token, tokenSecret, profile, done) {
        req.session.facebookToken = token;
        req.session.facebook = { };
        req.session.facebook.id = profile.id;
        req.session.facebook.access_token = token;
        return done(null, req.user);
    };

    this.loginSuccess = function(req, res) {
        console.log(req);
        res.redirect("/");
    };

    this.dbTest = function(req, res) {
        req.user.dbClient.getUserInfo(function(err, info) {
            if (err) {
                res.send(err);
            } else {
                res.send(info);
            }
        });
    };

    this.fbUpload = function(req, res) {
        if (req.account && req.session.share) {

            // post to fb
            FB.setAccessToken(req.session.facebook.access_token);
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
    };
    */
}

module.exports = ApplicationController;
