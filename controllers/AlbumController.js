var AlbumController = function() {
    var Album = require("../models/Album");

    if (!(this instanceof AlbumController)) {
        return new AlbumController();
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

    this.viewAll = function(req, res) {
        res.send("Coming soon!");
    };
};

module.exports = AlbumController;
