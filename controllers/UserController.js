var UserController = function() {
    var User = require("../models/User");

    if (!(this instanceof UserController)) {
        return new UserController();
    }

    this.create = function(req, res) {
        res.send("Coming soon!");
    };

    this.update = function(req, res) {
        res.send("Coming soon!");
    };

    this.destroy = function(req, res) {
        res.send("Coming soon!");
    };

    this.scanDropbox = function(dbClient) {

    };
}

module.exports = UserController;
