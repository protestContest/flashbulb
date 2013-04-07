var UserController = function() {
    var User = require("../models/User");

    if (!(this instanceof UserController)) {
        return new UserController();
    }

    this.all = function(req, res) {
        User.getAll(function(err, users) {
            res.render("user/all", {"users": users});
        });
    };

    this.view = function(req, res) {
        User.get(req.params.id, function(err, user) {
            if (err) { res.render("error", err); }
            res.render("user/view", user);
        });
    };

    this.createForm = function(req, res) {
        res.render("user/create");
    };

    this.create = function(req, res) {
        res.send("Coming soon!");
    };

    this.updateForm = function(req, res) {
        User.get(req.params.id, function(err, user) {
            if (err) { res.render("error", err); }
            res.render("user/update", {"user": user});
        });
    };

    this.update = function(req, res) {
        res.send("Coming soon!");
    };

    this.destroy = function(req, res) {
        res.send("Coming soon!");
    };

    this.home = function(req, res) {
        User.get(req.user.email, function(err, user) {
            res.render("user/home", {
                "albums": user.albums.map(function(album) {
                    return album.name;
                }) || "no albums"
            });
        });
    };

}

module.exports = UserController;
