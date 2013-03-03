var Dropbox = require("dropbox")
  , crypto = require("crypto")
  ;

var UserController = function(credentials) {
    var User
      ;

    if (!(this instanceof UserController)) {
        return new UserController(credentials);
    }

    User = require("../models/User");
    dropbox = new Dropbox.Client({
        key: credentials.dropbox.appkey,
        secret: credentials.dropbox.secret,
        sandbox: true
    });

    this.settings = function(req, res) {
        res.render("settings", {user: req.user});
    };
}

module.exports = UserController;
