var User;

var ApplicationController = function() {
    if (!(this instanceof ApplicationController)) {
        return new ApplicationController();
    }

    User = require("../models/User");

    this.home = function(req, res) {

    };

    this.dbAuthenticate = function(token, tokenSecret, profile, done) {
        User.findOrCreate({ dropboxId: profile.id }, function(err, user) {
            return done(err, user);
        });
    };

}

module.exports = ApplicationController;
