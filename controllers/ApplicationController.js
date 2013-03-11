var Dropbox = require("dropbox")
  , crypto = require("crypto")
  , https = require("https")
  , FB = require("fb")
  , jade = require("jade")
  ;

var ApplicationController = function(credentials) {
    var User
      ;

    if (!(this instanceof ApplicationController)) {
        return new ApplicationController(credentials);
    }

    User = require("../models/User");
    dropbox = new Dropbox.Client({
        key: credentials.dropbox.appkey,
        secret: credentials.dropbox.secret,
        sandbox: true
    });

    this.index = function(req, res) {
        if (req.isAuthenticated()) {
            dropbox.readdir("/", function(err, files) {
                var data = {
                    title: "All Pictures",
                    user: req.user,
                    files: files,
                    access_token: req.session.facebookToken
                };
                res.render("user/base-user", data, function(err, baseHtml) {
                    res.render("user/all", data, function(err, html) {
                        res.send(baseHtml + html);
                    });
                });
            });
        } else {
            res.render("home");
        }
    };

    this.allFiles = function(req, res) {
        dropbox.readdir("/", function(err, files) {
            var data = {
                title: "All Pictures",
                user: req.user,
                files: files,
                access_token: req.session.facebookToken
            };
            res.render("user/all", data, function(err, html) {
                var ret = { };
                ret.content = html;

                res.render("user/all-toolbar", data, function(err, html) {
                    ret.toolbar = html;

                    res.send(ret);
                });
            });
        });
    };

    this.albums = function(req, res) {
        dropbox.readdir("/", function(err, files) {
            var data = {
                title: "Albums",
                user: req.user,
                files: files
            };
            res.render("user/albums", data, function(err, html) {
                var ret = { };
                ret.content = html;

                res.render("user/albums-toolbar", data, function(err, html) {
                    console.log(html);
                    ret.toolbar = html;

                    res.send(ret);
                });
            });
        });
    };

    this.auth = function(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect("/");
        }

    };

    this.dbAuthenticate = function(token, tokenSecret, profile, done) {
        dropbox.oauth.setToken(token, tokenSecret);
        dropbox.getUserInfo(function(err, userInfo) {
            if (err) { done(err); }
            else {
                User.findOrCreate({ dropboxId: profile.id }, userInfo,
                    function(err, user) {
                        return done(err, user);
                    }
                );
            }
        });
    };

    this.fbAuthenticate = function(req, token, tokenSecret, profile, done) {
        req.session.facebookToken = token;
        req.session.facebook = { };
        req.session.facebook.id = profile.id;
        req.session.facebook.access_token = token;
        return done(null, req.user);
    };

    this.loginSuccess = function(req, res) {
        res.redirect("/");
    };

    this.logout = function(req, res) {
        req.logout();
        dropbox.signOut();
        delete req.user;
        delete req.account;
        res.redirect("/");
    };

    this.dbTest = function(req, res) {
        dropbox.getUserInfo(function(err, info) {
            if (err) {
                res.send(err);
            } else {
                res.send(info);
            }
        });
    };

    this.getFile = function(req, res) {
        dropbox.readFile(req.params.path, {buffer: true}, function(err, data) {
            if (err) {
                console.log(err);
                res.redirect("/auth/dropbox");
            } else {
                res.setHeader("Content-type", "image");
                res.send(data);
            }
        });
    }

    this.editFile = function(req, res) {
        dropbox.readFile(req.params.path, {buffer: true}, function(err, data) {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                res.render("user/edit", {
                    title: "Albums",
                    user: req.user,
                    editFile: data
                });
            }
        });
        res.redirect("/file/" + req.params.path);
    };

    function loadFile(url) {
        if (url.substr(0, 5) === "/file") {
            url = url.substr(5);
        }
        dropbox.readFile(url, { "buffer": true }, function(err, data) {
            if (err) {
                console.log(err);
                return null;
            } else {
                return data;
            }
        });
    }

    this.fbUpload = function(req, res) {
        if (req.account && req.session.share) {

            // post to fb
            FB.setAccessToken(req.session.facebook.access_token);
            FB.api("me/photos", "post", {
                "message": "Test post, please ignore",
                //"url": "http://127.0.0.1:3000" + req.session.share.url
                "source": loadFile(req.session.share.url),
                "fileUpload": true,
                "enctype": "multipart/form-data"
            }, function(res) {
                if (!res || res.error) {
                    console.log(!res ? "fb upload error!" : res.error);
                }
            });

            //var fbPost = https.request({
            //    host: "graph.facebook.com",
            //    port: 443,
            //    path: "/" + req.session.facebook.id + "/photos?access_token=" + req.session.facebook.access_token,
            //    method: "POST"
            //}, function(res) {
            //    res.setEncoding("utf-8");
            //    var resString = "";

            //    res.on("data", function(data) {
            //        resString += data;
            //    });

            //    res.on("end", function() {
            //        console.log(resString);
            //    });
            //});

            //fbPost.on("error", function(err) {
            //    console.log(err);
            //});
            //
            //fbPost.write(JSON.stringify({
            //    "message": req.session.share.desc,
            //    "source": loadFile(url)
            //}));
            //fbPost.end();

            res.redirect(req.session.share.returnURL);
        } else {
            res.redirect("/");
        }
    };

    this.getPublicUrl = function(req, res) {
        if (req.params.path.substr(0, 5) === "/file") {
            req.params.path = req.params.path.substr(5);
        }
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
    };

}

module.exports = ApplicationController;
