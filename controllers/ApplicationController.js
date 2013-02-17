var Dropbox = require("dropbox")
  , crypto = require("crypto")
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

    this.home = function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user", {user: req.user});
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

    this.loginSuccess = function(req, res) {
        res.redirect("/");
    };

    this.logout = function(req, res) {
        req.logout();
        dropbox.signOut();
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

}

module.exports = ApplicationController;
