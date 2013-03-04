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

    this.allFiles = function(req, res) {
        if (req.isAuthenticated()) {
            dropbox.readdir("/", function(err, files) {
                res.render("user/all", {
                    title: "All Pictures",
                    user: req.user,
                    files: files
                });
            });
        } else {
            res.render("home");
        }
    };

    this.albums = function(req, res) {
        dropbox.readdir("/", function(err, files) {
            res.render("user/albums", {
                title: "Albums",
                user: req.user,
                files: files
            });
        });
    };

    this.auth = function(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect("/");
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
        delete req.user;
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

    this.getFile = function(req, res) {
        dropbox.readFile(req.params.path, {buffer: true}, function(err, data) {
            if (err) {
                console.log(err);
                res.redirect("/auth/dropbox");
            } else {
                res.setHeader("Content-type", "image");
                res.send(data);
            }
        });
    }

    this.editFile = function(req, res) {
        dropbox.readFile(req.params.path, {buffer: true}, function(err, data) {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                res.render("user/edit", {
                    title: "Albums",
                    user: req.user,
                    editFile: data
                });
            }
        });
        res.redirect("/file/" + req.params.path);
    };

}

module.exports = ApplicationController;
