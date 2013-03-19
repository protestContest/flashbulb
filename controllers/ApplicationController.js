var Dropbox = require("dropbox")
  , crypto = require("crypto")
  , https = require("https")
  , FB = require("fb")
  , jade = require("jade")
  ;

var ApplicationController = function(credentials) {
    var User
      ;

    if (!(this instanceof ApplicationController)) {
        return new ApplicationController(credentials);
    }

    User = require("../models/User");
    dropbox = new Dropbox.Client({
        key: credentials.dropbox.appkey,
        secret: credentials.dropbox.secret,
        sandbox: true
    });

    this.index = function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect("/all");
        } else {
            res.render("home");
        }
    };

    this.dbAuthenticate = function(token, tokenSecret, profile, done) {
        dropbox.oauth.setToken(token, tokenSecret);
        dropbox.getUserInfo(function(err, userInfo) {
            if (err) { done(err); }
            else {
                User.findOrCreate({ dropboxId: profile.id }, userInfo,
                    function(err, user) {
                        return done(err, user);
                    }
                );
            }
        });
    };

    this.fbAuthenticate = function(req, token, tokenSecret, profile, done) {
        req.session.facebookToken = token;
        req.session.facebook = { };
        req.session.facebook.id = profile.id;
        req.session.facebook.access_token = token;
        return done(null, req.user);
    };

    this.loginSuccess = function(req, res) {
        res.redirect("/");
    };

    this.logout = function(req, res) {
        req.logout();
        dropbox.signOut();
        delete req.user;
        delete req.account;
        res.redirect("/");
    };

    this.dbTest = function(req, res) {
        dropbox.getUserInfo(function(err, info) {
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

}

module.exports = ApplicationController;
