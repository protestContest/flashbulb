var mongoose = require("mongoose"), 
    Schema = mongoose.Schema,
    Album = require("./Album");

var UserSchema = new Schema(  {
    email: {type:String, unique:true},
    name: String,
    dropboxId: String,
    albums: [Album]
});

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

UserSchema.static("get", function(email, callback) {
    User.findOne({"email": email}, function(err, user) {
        if (err) { callback(err); }
        else if (user) {
            callback(null, user);
        } else {
            callback("user not found");
        }
    });
});

UserSchema.method("update", function(attrs, callback) {
    callback(null);
});

UserSchema.method("destroy", function(callback) {
    callback(null);
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


mongoose.model('User', UserSchema);
var User = mongoose.model('User');

module.exports = User;
