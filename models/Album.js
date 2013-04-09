var mongoose = require("mongoose"),
    Schemas = require("./Schemas"),
    PhotoSchema = Schemas.Photo,
    AlbumSchema = Schemas.Album,
    Photo = require("./Photo"),
    User = require("./User");

/** creates a new album, and returns it */
AlbumSchema.static("create", function(attrs, callback) {
    if (attrs.name === undefined || attrs.user === undefined) {
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
    Album.findOne({$and: [{user: userEmail}, {name: name}]}, function(err, album) {
        if (err) {
            callback(err);
        } else {
            if (!album) {
                callback("album not found");
            } else {
                callback(null, album);
            }
        }
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

AlbumSchema.method("addPhoto", function(photo, callback) {
    this.photos.push(photo);
    this.save(function(err) {
        callback(err);
    });
});

AlbumSchema.method("addNewPhoto", function(url, callback) {
    Photo.create({
        "url": url,
        "album": this.name
    }, function(err, photo) {
        if (err) {
            callback(err);
        } else {
            this.addPhoto(photo, callback);
        }
    });
});

AlbumSchema.method("updatePhoto", function(url, attrs, callback) {
    Photo.get(this.name, url, function(err, photo) {
        if (err) {
            callback(err);
        } else {
            if (attrs.album !== undefined) {
                this.photos.splice(this.photos.indexOf(url), 1);
                Album.get(this.user, attrs.album, function(err, album) {
                    album.addPhoto(url, function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            photo.update(attrs, callback);
                        }
                    });
                });
            } else {
                if (attrs.url !== undefined) {
                    this.photos[this.photos.indexOf(url)] = attrs.url;
                }
                photo.update(attrs, callback);
            } 
        }
    });
});

AlbumSchema.method("removePhoto", function(url, callback) {
    Photo.get(this.name, url, function(err, photo) {
        if (err) {
            callback(err);
        } else {
            this.photos.splice(this.photos.indexOf(url), 1);
            photo.destroy(function(err) {
                callback(err);
            });
        }
    });
});

mongoose.model("Album", AlbumSchema);
var Album = mongoose.model("Album");
module.exports = Album;
