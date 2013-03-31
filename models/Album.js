var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    User = require("./User"),
    Photo = require("./Photo");

var AlbumSchema = new Schema({
    albumId: String,
    name: String,
    user: User,
    photos: [Photo]
});

AlbumSchema.static("create", function(attrs, callback) {
    if (attrs.user === undefined || attrs.user.email === undefined || 
            attrs.name === undefined) {
        callback("wrong attributes");
    } else {
        Album.findOne({
            "albumId": attrs.user.email + ":" + attrs.name
        }, function(err, album) {
            if (err) { callback(err); }
            else if (album) {
                callback("album exists");
            } else {
                var newAlbum = new Album(attrs);
                newAlbum.albumId = attrs.user.email + ":" + attrs.name;
                newAlbum.save(function(err) {
                    if (err) { callback(err); }
                    else {
                        callback(null, newAlbum);
                    }
                });
            }
        });
    }
});

AlbumSchema.static("get", function(albumId, callback) {
    Album.findOne({"albumId": albumId}, function(err, album) {
        if (err) { callback(err); }
        else if (album) {
            callback(null, album);
        } else {
            callback("album not found");
        }
    });
});

AlbumSchema.method("update", function(attrs, callback) {
    for (var attr in attrs) {
        this[attr] = attrs[attr];
    }

    this.albumId = this.user.email + ":" + this.name;

    this.save(function(err) {
        if (err) { callback(err); }
        else {
            callback(null);
        }
    });
});

AlbumSchema.method("destroy", function(callback) {
    Album.remove({ albumId: this.albumId}, callback);
});

mongoose.model("Album", AlbumSchema);
var Album = mongoose.model("Album");
module.exports = Album;
