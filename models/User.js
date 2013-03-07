var mongoose = require("mongoose")
  , crypto = require("crypto")
  , Schema = mongoose.Schema
  ;

var UserSchema = new Schema(  {
    email: {type:String, unique:true},
    name: String,
    dropboxId: String,
    albums: [String]
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
