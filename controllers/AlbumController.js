var User = require("../models/User"),
    Album = require("../models/Album");

var AlbumController = function() {
    if (!(this instanceof AlbumController)) {
        return new AlbumController();
    }

    this.all = function(req, res) {
        User.get(req.session.user.email, function(err, user) {
            if (err) { 
                res.render("error", {"error": err} );
            } else {
                res.render("album/all", {"albums": user.albums});
            }
        });
    };

    this.view = function(req, res) {
        Album.get(req.session.user.email, albumId, function(err, album) {
            if (err) {
                res.render("error", {"error": err} );
            } else {
                res.render("album/view", {
                    photos: album.photos.map(function(photo) {
                        return photo.url;
                    })
                });
            }
        });
    };

    this.createForm = function(req, res) {
        res.render("album/create");
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
        Album.get(req.session.user.email, req.params.id, function(err, album) {
            if (err) {
                res.render("error", {"error": err});
            } else {
                res.render("album/update", {"album": album});
            }
        });
    };

    this.update = function(req, res) {
        Album.get(req.session.user.email, req.params.id, function(err, album) {
            if (err) {
                res.render("error", {"error": err} );
            } else {
                album.update(req.body, function(err) {
                    if (err) {
                        res.render("error", {"error": err} );
                    } else {
                        res.redirect("/albums/" + req.params.id);
                    }
                });
            }
        });
    };

    this.destroy = function(req, res) {
        Album.get(req.session.user.email, req.params.id, function(err, album) {
            if (err) {
                res.render("error", {"error": err});
            } else {
                album.destroy(function(err) {
                    if (err) {
                        res.render("error", {"error": err});
                    } else {
                        res.redirect("/albums");
                    }
                });
            }
        });
    };
};

module.exports = AlbumController;
