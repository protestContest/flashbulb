var Dropbox = require("dropbox")
  , crypto = require("crypto")
  , https = require("https")
  , FB = require("fb")
  , jade = require("jade")
  ;

var ApplicationController = function(credentials) {
    var User,
        dClient,
        dropboxes = {};

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
        res.render("home");
    };

    this.dbAuthenticate = function(req, token, tokenSecret, profile, done) {
        dropboxes[profile.id] = new Dropbox.Client({
            key: credentials.dropbox.appkey,
            secret: credentials.dropbox.secret,
            sandbox: true
        });
        dropboxes[profile.id].oauth.setToken(token, tokenSecret);


        dropboxes[profile.id].getUserInfo(function(err, userInfo) {
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
            res.redirect("/album/123");
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

    this.logout = function(req, res) {
        var dropbox = dropboxes[req.user.dropboxId];
        dropbox.getUserInfo(function(err, info) {
            console.log(info);
        });

        req.logout();
        delete req.user;
        delete req.account;
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
