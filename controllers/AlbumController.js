var AlbumController = function() {
    var Album = require("../models/Album");

    if (!(this instanceof AlbumController)) {
        return new AlbumController();
    }

    this.view = function(req, res) {
        var albumId = req.user.email + ":" + req.params.id;
        Album.get(albumId, function(err, album) {
            res.render("album", {
                photos: album.photos.map(function(photo) {
                    return photo.url;
                })
            });
        });
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
