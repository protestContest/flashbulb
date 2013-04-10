var User = require("../models/User"),
    redis = require("redis"),
    Dropbox = require("dropbox");

var AlbumController = function(credentials) {
    var rClient = redis.createClient(credentials.redis.port,
                    credentials.redis.host);

    rClient.auth(credentials.redis.auth);

    if (!(this instanceof AlbumController)) {
        return new AlbumController(credentials);
    }

    this.all = function(req, res) {
        User.get(req.session.user.email, function(err, user) {
            getDropbox(user.dropboxId, function(err, dropbox) {
                dropbox.stat("/", {"readDir": true}, function(err, folderStat, stats) {
                    if (err) {
                        res.render("error", {"error": err});
                    } else {
                        res.render("album/all", {
                            "user": user.name,
                            "albums": stats.filter(function(entry) {
                                return entry.isFolder;
                            }).map(function(entry) {
                                return entry.name;
                            })
                        });
                    }
                });
            });
        });
    };

    this.view = function(req, res) {
        var albumPath = req.params.album;
        if (req.params.album === "Unsorted") {
            albumPath = "";
        }
        getDropbox(req.session.user.dropboxId, function(err, dropbox) {
            dropbox.stat("/" + albumPath, {"readDir": true}, function(err, folder, entries) {
                if (err) {
                    res.render("error", {"error": err});
                } else {
                    getAlbumList(dropbox, function(err, albums) {
                        res.render("album/view", {
                            "name": req.params.album,
                            "photos": entries.filter(function(entry) {
                                return /.*(\.jpg|\.png|\.gif)/.test(entry.name);
                            }),
                            "albums": albums.map(function(album) {
                                return album.name;
                            })
                        });
                    });
                }
            });
        });
    };

    this.getAlbumList = getAlbumList;
    
    function getAlbumList(dropbox, callback) {
        dropbox.readdir("/", function(err, names, folder, folderEntries) {
            if (err) {
                callback(err);
            } else {
                callback(null, folderEntries.filter(function(entry) {
                    return entry.isFolder;
                }));
            }
        });
    };

    this.createForm = function(req, res) {
        res.render("album/create");
    };

    this.create = function(req, res) {
        if (req.body.name === "Unsorted") {
            res.render("error", {"error": "Album name is reserved"});
        } else {
            User.get(req.session.user.email, function(err, user) {
                getDropbox(user.dropboxId, function(err, dropbox) {
                    dropbox.readdir("/", function(err, entries) {
                        console.log(req.body);
                        dropbox.mkdir(req.body.name, function(err, stat) {
                            if (err) {
                                res.render("error", {"error": err});
                            } else {
                                res.redirect("/albums");
                            }
                        });
                    });
                });
            });
        }
    };

    this.updateForm = function(req, res) {
        User.get(req.session.user.email, function(err, user) {
            if (err) {
                res.render("error", {"error": err});
            } else {
                user.getAlbum(req.params.id, function(err, album) {
                    if (err) {
                        res.render("error", {"error": err});
                    } else {
                        res.render("album/update", {"album": album});
                    }
                });
            }
        });
    };

    this.update = function(req, res) {
        User.get(req.session.user.email, function(err, user) {
            if (err) {
                res.render("error", {"error": err} );
            } else {
                user.updateAlbum(req.params.id, req.body, function(err) {
                    if (err) {
                        res.render("error", {"error": err} );
                    } else {
                        res.redirect("/albums");
                    }
                });
            }
        });
    };

    this.destroy = function(req, res) {
        console.log("Deleting an album: " + req.params.album);
        getDropbox(req.session.user.dropboxId, function(err, dropbox) {
            dropbox.unlink("/" + req.params.album, function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.redirect("/home");
                }
            });
        });
    };

    function getDropbox(dropboxId, callback) {
        rClient.hget("dropboxes", dropboxId, function(err, tokenStr) {
            var tokens = JSON.parse(tokenStr),
                dropbox = new Dropbox.Client({
                    key: credentials.dropbox.appkey,
                    secret: credentials.dropbox.secret,
                    sandbox: true
                });

            dropbox.oauth.setToken(tokens["token"], tokens["secret"]);
            callback(err, dropbox);
        });
    }
};

module.exports = AlbumController;
