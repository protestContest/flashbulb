var Dropbox = require("dropbox"),
    redis = require("redis");

var watcher = function(dropboxId, credentials, callback) {
    var rClient = redis.createClient(),
        dropbox = new Dropbox.Client({
            key: credentials.dropbox.appkey,
            secret: credentials.dropbox.secret,
            sandbox: true
        });

    rClient.hget("dropboxes", dropboxId, function(err, res) {
        var tokens = JSON.parse(res);
        dropbox.oauth.setToken(tokens["token"], tokens["secret"]);
        callback(err);
    });

    this.watchDropbox = function(interval) {
        setInterval(scanDropbox, interval);
    };

    function scanDropbox() {
        dropbox.readdir("/", function(err, entries) {
            if (err) {
                console.log("Scan error: " + err);
            }

            entries.forEach(function(entry) {
                console.log(entry);
            });
            console.log("----------------------------");
        });
    }
};

module.exports = watcher;
