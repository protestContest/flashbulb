var User = require("../models/User")
  , redis = require("redis")
  , Dropbox = require("dropbox")
  , rClient
  , credentials
  ;

// constructor
module.exports = function(creds) {
    credentials = creds;
    rClient = redis.createClient(credentials.redis.port,
                                     credentials.redis.host);
    rClient.auth(credentials.redis.auth);

    return AlbumController;
}

// private methods
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

// public API
var AlbumController = {
    "all": function(req, res) {
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
    },

    "view": function(req, res) {
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
                        var data = {
                            "name": req.params.album,
                            "photos": entries.filter(function(entry) {
                                return /.*(\.jpg|\.png|\.gif)/.test(entry.name);
                            }),
                            "albums": albums.map(function(album) {
                                return album.name;
                            }),
                            "fbToken": req.session.fbToken
                        };
                        res.render("album/view", data);
                    });
                }
            });
        });
    },

    "getAlbumList": function(dropbox, callback) {
        dropbox.readdir("/", function(err, names, folder, folderEntries) {
            if (err) {
                callback(err);
            } else {
                callback(null, folderEntries.filter(function(entry) {
                    return entry.isFolder;
                }));
            }
        });
    },

    "createForm": function(req, res) {
        res.render("album/create");
    },

    "create": function(req, res) {
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
    },

    "destroy": function(req, res) {
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
    },

};

