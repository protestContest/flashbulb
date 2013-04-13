var redis = require("redis"),
    Dropbox = require("dropbox"),
    Photo = require("../models/Photo"),
    AlbumCon = require("./AlbumController.js"),
    fs = require("fs");

var PhotoController = function(credentials) {
    var Album = new AlbumCon(credentials),
        rClient = redis.createClient(credentials.redis.port,
                    credentials.redis.host);

    rClient.auth(credentials.redis.auth);

    if (!(this instanceof PhotoController)) {
        return new PhotoController(credentials);
    }

    this.all = function(req, res) {
        getDropbox(req.session.user.dropboxId, function(err, dropbox) {
            dropbox.findByName("/", ".jpg", function(err, photos) {
                if (err) {
                    res.render("error", {"error": err});
                } else {
                    Album.getAlbumList(dropbox, function(err, albums) {
                        var data = {
                            "name": "All Photos",
                            "photos": photos,
                            "albums": albums.map(function(album) {
                                return album.name;
                            }),
                            "fbToken": req.session.fbToken
                        };
                        res.render("photo/all", data);
                    });
                }
            });
        });
    };

    this.view = function(req, res) {
        res.send("Coming soon!");
    };

    this.create = function(req, res) {
        res.send("Coming soon!");
    };

    this.update = function(req, res) {
        res.send("Coming soon!");
    };

    this.destroy = function(req, res) {
        res.send("Coming soon!");
    };

    this.get = function(req, res) {
        var path = (req.params.album ? "/" + req.params.album : "" ) + "/" + req.params.photo;
        getDropbox(req.session.user.dropboxId, function(err, dropbox) {
            dropbox.readFile(path, {"buffer": true}, function(err, data) {
                if (err) {
                    res.end();
                } else {
                    res.setHeader("Content-type", "image");
                    res.send(data);
                }
            });
        });
    };

    this.move = function(req, res) {
        if (req.body.to === "/Unsorted") {
            req.body.to = "";
        }
        getDropbox(req.session.user.dropboxId, function(err, dropbox) {
            dropbox.move(req.body.from + req.body.photo, req.body.to + req.body.photo,
                    function(err) {
                if (err) {
                    res.render("error", {"error": err});
                } else {
                    res.redirect("/albums" + req.body.from);
                }
            });
        });
    };

    this.getPublicUrl = function(req, res) {
        if (req.params.path.substr(0, 5) === "/file") {
            req.params.path = req.params.path.substr(5);
        }
        getDropbox(req.session.user.dropboxId, function(err, dropbox) {
            dropbox.makeUrl(req.params.path, {
                "download": true,
                "downloadHack": true
            }, function(err, url) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(url);
                }
            });
        });
    };

    this.upload = function(req, res) {
        var album = "";
        if (req.params.album && req.params.album !== "Unsorted") {
            album = req.params.album;
        }

        getDropbox(req.session.user.dropboxId, function(err, dropbox) {
            if (err) { res.send("Upload error: " + err); }
            else {
                for (var fn in req.files) {
                    var file = req.files[fn];
                    fileData = fs.readFileSync(file.path);
                    dropbox.writeFile("/" + album + "/" + file.name, fileData, {
                        "noOverwrite": true
                    }, function(err, stat) {
                        if (err) { res.send("Write error: " + err); }
                        else {
                            res.send("Upload success");
                        }
                    });
                }
            }
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

module.exports = PhotoController;
