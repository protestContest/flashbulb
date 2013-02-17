var mongoose = require("mongoose");
var crypto = require("crypto");


var secret = "@#$af$#@F";
var Schema = mongoose.Schema;

var UserSchema = new Schema(  {
    email: {type:String, unique:true},
    firstName: String,
    lastName: String,
    dropboxId: String
});


UserSchema.static("findOrCreate", function(query, callback)  {
    User.findOne(query, function(error, user)  {
        if(error)  {
            callback(error);
        } else if(user)  {
            callback("email or userid already taken, try choosing another");
        } else  {
            var u = new User({"email":email});
            u.save(function(error)  {
                if(error)  {
                    callback(error);
                }  else  {
                    callback("user created<br/>userid:"+name+"<br/>email:"+email+"<br/>password: " + pw);
                }
            });
        }
    });
});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

module.exports = User;
