var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    User = require("./User");
    Album = require("./Album");

var PhotoSchema = new Schema({
    photoId: String,
    album: Album,
    url: String
});

PhotoSchema.static("create", function(attrs, callback) {
    if (attrs.album === undefined || attrs.url === undefined) {
        callback("wrong attributes");
    } else {
        Photo.findOne({
            "photoId": attrs.album.albumId + attrs.url
        }, function(err, album) {
            if (err) { callback(err); }
            else if (album) {
                callback("photo exists");
            } else {
                var newPhoto = new Photo(attrs);
                newPhoto.photoId = attrs.album.albumId + attrs.url;
                newPhoto.save(function(err) {
                    if (err) { callback(err); }
                    else {
                        callback(null, newPhoto);
                    }
                });
            }
        });
    }
});

PhotoSchema.static("get", function(photoId, callback) {
    Photo.findOne({"photoId": photoId}, function(err, photo) {
        if (err) { callback(err); }
        else if (photo) {
            callback(null, photo);
        } else {
            callback("photo not found");
        }
    });
});

PhotoSchema.method("update", function(attrs, callback) {
    for (var attr in attrs) {
        this[attr] = attrs[attr];
    }

    this.photoId = this.album.albumId + this.url;

    this.save(function(err) {
        if (err) { callback(err); }
        else {
            callback(null);
        }
    });
});

PhotoSchema.method("destroy", function(callback) {
    Photo.remove({ albumId: this.albumId}, callback);
});

mongoose.model("Photo", PhotoSchema);
var Photo = mongoose.model("Photo");
module.exports = Photo;
