var Album = require("../models/Album"),
    User = require("../models/User");

var AlbumController = function() {
    if (!(this instanceof AlbumController)) {
        return new AlbumController();
    }

    this.viewAll = function(req, res) {
        User.get(req.session.user.email, function(err, user) {
            if (err) { return abort(err); }

            res.send(user.albums);
        });
    };

    this.view = function(req, res) {
        Album.get(albumId, function(err, album) {
            res.render("album/view", {
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

    this.updateForm = function(req, res) {
        res.render("user/updateForm");
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
