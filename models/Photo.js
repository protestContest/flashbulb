var mongoose = require("mongoose"),
    Schemas = require("./Schemas"),
    PhotoSchema = Schemas.Photo,
    User = require("./User"),
    Album = require("./Album");

PhotoSchema.static("create", function(attrs, callback) {
    if (attrs.url === undefined || attrs.album === undefined) {
        callback("wrong attributes");
    } else {
        Photo.findOne({
            "url": attrs.url
        }, function(err, photo) {
            if (err) { callback(err); }
            else if (photo) {
                callback("photo exists");
            } else {
                var newPhoto = new Photo(attrs);
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

PhotoSchema.static("get", function(album, url, callback) {
    Photo.findOne({$and: [{"album": album}, {"url": url}]}, function(err, photo) {
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
