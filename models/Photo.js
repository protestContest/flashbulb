var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    User = require("./User");
    Album = require("./Album");

var PhotoSchema = new Schema({
    album: Album,
    url: String
});

PhotoSchema.static("create", function(attrs, callback) {
    if (attrs.user === undefined || attrs.user.email === undefined || 
            attrs.name === undefined) {
        callback("wrong attributes");
    } else {
        Photo.findOne({
            "albumId": attrs.user.email + ":" + attrs.name
        }, function(err, album) {
            if (err) { callback(err); }
            else if (album) {
                callback("album exists");
            } else {
                var newPhoto = new Photo(attrs);
                newPhoto.albumId = attrs.user.email + ":" + attrs.name;
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

PhotoSchema.static("get", function(albumId, callback) {
    Photo.findOne({"albumId": albumId}, function(err, album) {
        if (err) { callback(err); }
        else if (album) {
            callback(null, album);
        } else {
            callback("album not found");
        }
    });
});

PhotoSchema.method("update", function(attrs, callback) {
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

PhotoSchema.method("destroy", function(callback) {
    Photo.remove({ albumId: this.albumId}, callback);
});

mongoose.model("Photo", PhotoSchema);
var Photo = mongoose.model("Photo");
module.exports = Photo;
