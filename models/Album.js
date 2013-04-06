var mongoose = require("mongoose"),
    Schemas = require("./Schemas"),
    PhotoSchema = Schemas.Photo,
    AlbumSchema = Schemas.Album,
    Photo = require("./Photo"),
    User = require("./User");

/** creates a new album, and returns it */
AlbumSchema.static("create", function(attrs, callback) {
    if (attrs.name === undefined) {
        callback("wrong attributes");
    } else {
        var newAlbum = new Album(attrs);
        newAlbum.save(function(err) {
            if (err) { callback(err); }
            else {
                callback(null, newAlbum);
            }
        });
    }
});

/** finds an album with a user and name */
AlbumSchema.static("get", function(userEmail, name, callback) {
    User.get(userEmail, function(err, user) {
        if (err) { return callback(err); }
        if (!user) { return callback("user not found"); }

        var album = user.albums.filter(function(album) {
            return (album.name === name);
        })[0];

        if (!album) { return callback("album not found"); }

        callback(null, album);
    });
});

/** updates an album */
AlbumSchema.method("update", function(attrs, callback) {
    for (var attr in attrs) {
        this[attr] = attrs[attr];
    }

    this.save(function(err) {
        callback(err);
    });
});

AlbumSchema.method("destroy", function(callback) {
    Album.remove({ _id: this._id}, callback);
});

mongoose.model("Album", AlbumSchema);
var Album = mongoose.model("Album");
module.exports = Album;
