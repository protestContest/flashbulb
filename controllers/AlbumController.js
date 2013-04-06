var Album = require("../models/Album"),
    User = require("../models/User");

var AlbumController = function() {
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
        User.get(req.user.email, function(err, user) {
            Album.create({
                "user": user,
                "name": req.body.albumName
            }, function(err, album) {
                user.addAlbum(album, function() {
                    res.redirect("/home");
                });
            });
        });
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
