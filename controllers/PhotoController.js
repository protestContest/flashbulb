var PhotoController = function() {
    var Photo = require("../models/Photo");

    if (!(this instanceof PhotoController)) {
        return new PhotoController();
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
};

module.exports = PhotoController;
