var  Dropbox = require("dropbox").Client;

var UserController = function() {
    var User = require("../models/User");

    if (!(this instanceof UserController)) {
        return new UserController();
    }


    this.create = function(req, res) {
        res.send("Coming soon!");
    };

    this.update = function(req, res) {
        res.send("Coming soon!");
    };

    this.destroy = function(req, res) {
        res.send("Coming soon!");
    };

    this.addClient = function(id, client) {
        console.log(client);
        dbClients[id] = client;
    };

    this.scan = function(req, res) {
        var dropbox = new Dropbox({
            key: req.session.dropbox.oauth.key,
            secret: req.session.dropbox.oauth.secret,
            sandbox: true
        });
        scanDropbox(dropbox);
    };

    function scanDropbox(dbClient) {
        dbClient.readdir("/", function(err, items) {
            if (err) {
                console.log(err);
            } else {
                items.forEach(function(item, i) {
                    dbClient.readdir(item, function(err, items) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            }
        });
    };
};

module.exports = UserController;
