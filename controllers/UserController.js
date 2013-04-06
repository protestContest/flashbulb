var UserController = function() {
    var User = require("../models/User");

    if (!(this instanceof UserController)) {
        return new UserController();
    }

    this.view = function(req, res) {
        res.send("Coming soon!");
    };

    this.create = function(req, res) {
        res.send("Coming soon!");
    };

    this.update = function(req, res) {
        res.send("Coming soon!");
    };

    this.destroy = function(req, res) {
        res.send("Coming soon!");
    };

    this.home = function(req, res) {
        User.get(req.user.email, function(err, user) {
            res.render("userHome", {
                "albums": user.albums.map(function(album) {
                    return album.name;
                }) || "no albums"
            });
        });
    };

    this.listAll = function(req, res) {
        User.getAll(function(err, users) {
            res.send(users);
        });
    };
}

module.exports = UserController;
