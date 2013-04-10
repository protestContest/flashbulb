var redis = require("redis"),
    Dropbox = require("dropbox");

var UserController = function(credentials) {
    var User = require("../models/User"),
        rClient = redis.createClient();

    if (!(this instanceof UserController)) {
        return new UserController(credentials);
    }

    this.all = function(req, res) {
        User.getAll(function(err, users) {
            res.render("user/all", {"users": users});
        });
    };

    this.view = function(req, res) {
        User.get(req.params.id, function(err, user) {
            if (err) { 
                res.render("error", {"error": err}); 
            } else {
                res.render("user/view", {"user": user});
            }
        });
    };

    this.createForm = function(req, res) {
        res.render("user/create");
    };

    this.create = function(req, res) {
        User.create(req.body, function(err, user) {
            if (err) {
                res.render("error", {"error": err} );
            } else {
                res.redirect("/users/" + user.email);
            }
        });
    };

    this.updateForm = function(req, res) {
        User.get(req.params.id, function(err, user) {
            if (err) { res.render("error", err); }
            res.render("user/update", {"user": user});
        });
    };

    this.update = function(req, res) {
        User.get(req.params.id, function(err, user) {
            if (err) { res.render("error", {"err": err} ); }
            user.update(req.body, function(err) {
                if (err) {
                    res.render("error", {"err": err} );
                } else {
                    res.redirect("/users/" + req.params.id);
                }
            });
        });
    };

    this.destroy = function(req, res) {
        User.get(req.params.id, function(err, user) {
            if (err) {
                res.render("error", {"error": err} );
            } else {
                user.destroy(function(err) {
                    if (err) {
                        res.render("error", {"error": err} );
                    } else {
                        res.redirect("/users");
                    }
                });
            }
        });
    };

    this.home = function(req, res) {
        User.get(req.session.user.email, function(err, user) {
            getDropbox(user.dropboxId, function(err, dropbox) {
                dropbox.stat("/", {"readDir": true}, function(err, folderStat, stats) {
                    res.render("user/home", {
                        "albums": stats.filter(function(entry) {
                            return entry.isFolder;
                        }).map(function(entry) {
                            return entry.name;
                        })
                    });
                });
            });
        });
    };

    this.createAlbumForm = function(req, res) {
        res.render("user/createAlbum");
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

}

module.exports = UserController;
