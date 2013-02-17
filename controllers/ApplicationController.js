var User;

var ApplicationController = function() {
    if (!(this instanceof ApplicationController)) {
        return new ApplicationController();
    }

    User = require("../models/User");

    this.home = function(req, res) {
        res.render("home");
    };

    this.dbAuthenticate = function(token, tokenSecret, profile, done) {
        console.log("Authenticating via Dropbox");
        User.findOrCreate({ dropboxId: profile.id }, function(err, user) {
            return done(err, user);
        });
    };

    this.login = function(req, res) {
        console.log(req.user);
        res.render("login", { user: req.user });
    };

}

module.exports = ApplicationController;
