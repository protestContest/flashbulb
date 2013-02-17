var User;

var ApplicationController = function() {
    if (!(this instanceof ApplicationController)) {
        return new ApplicationController();
    }

    User = require("../models/User");

    this.home = function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user");
        } else {
            res.render("home");
        }
    };

    this.dbAuthenticate = function(token, tokenSecret, profile, done) {
        User.findOrCreate({ dropboxId: profile.id }, function(err, user) {
            return done(err, user);
        });
    };

    this.loginSuccess = function(req, res) {
        res.redirect("/");
    };

    this.logout = function(req, res) {
        req.logout();
        res.redirect("/");
    };

}

module.exports = ApplicationController;
