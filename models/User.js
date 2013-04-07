var mongoose = require("mongoose"), 
    Schemas = require("./Schemas"),
    AlbumSchema = Schemas.Album,
    UserSchema = Schemas.User,
    Album = require("./Album");

UserSchema.static("create", function(attrs, callback) {
    User.findOne({"email": attrs.email}, function(err, user) {
        if (err) { callback(err); }
        else if (user) {
            callback("user exists");
        } else {
            var newUser = new User(attrs);
            newUser.save(function(err) {
                if (err) { callback(err); }
                else {
                    callback(null, newUser);
                }
            });
        }
    });
});

UserSchema.static("get", function(id, callback) {
    User.findOne({$or: [{"email": id}, {"dropboxId": id}]}, function(err, user) {
        if (err) { callback(err); }
        else if (user) {
            callback(null, user);
        } else {
            callback("user not found");
        }
    });
});

UserSchema.method("update", function(attrs, callback) {
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

UserSchema.method("destroy", function(callback) {
    User.remove({ email: this.email}, callback);
});

UserSchema.static("findOrCreate", function(query, userInfo, callback)  {
    User.findOne(query, function(error, user)  {
        if(error)  {
            callback(error);
        } else if(user)  {
            callback(null, user);
        } else  {
            console.log("Creating user " + userInfo.name);
            var u = new User(query);
            u.email = userInfo.email;
            u.name = userInfo.name;
            u.save(function(error)  {
                if(error)  {
                    callback(error);
                }  else  {
                    callback(null, u);
                }
            });
        }
    });
});

UserSchema.method("addAlbum", function(album, callback) {
    this.albums.push(album);
    this.save(function(err) {
        callback(err);
    });
});

UserSchema.static("getAll", function(callback) {
    User.find({}, function(err, users) {
        if (err) { return callback(err); }

        callback(null, users);
    });
});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

module.exports = User;
