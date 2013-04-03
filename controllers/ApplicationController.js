var Dropbox = require("dropbox")
  , crypto = require("crypto")
  , https = require("https")
  , FB = require("fb")
  , jade = require("jade")
  ;

var ApplicationController = function(credentials) {
    var User;

    if (!(this instanceof ApplicationController)) {
        return new ApplicationController(credentials);
    }

    User = require("../models/User");
    var dClient = new Dropbox.Client({
        key: credentials.dropbox.appkey,
        secret: credentials.dropbox.secret,
        sandbox: true
    });
    dClient.authDriver(new Dropbox.Drivers.NodeServer());

    this.index = function(req, res) {
        res.render("home");
    };

    this.login =  function(req, res) {
        console.log("about to auth with db");
        dClient.authenticate(function(err, client) {
            console.log("auth'd with db");
            if (err) {
                res.send(err);
            }

            req.session.dropbox = client;
            res.send(client);
        });
    };

    this.dbCallback = function(req, res) {
        console.log("Callback!");
        res.send(req.params);
    };


/***************************/

    this.dbAuthenticate = function(req, token, tokenSecret, profile, done) {
        var dropbox = createDropboxClient(token, tokenSecret);
        dropbox.getUserInfo(function(err, userInfo) {
            if (err) { done(err); }
            else {
                User.findOrCreate({ dropboxId: profile.id }, userInfo,
                    function(err, user) {
                        user.dbClient = dropbox;
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
        console.log(req);
        res.redirect("/");
    };

    this.logout = function(req, res) {
        req.logout();
        req.user.dbClient.signOut();
        delete req.user;
        delete req.account;
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

}

module.exports = ApplicationController;
