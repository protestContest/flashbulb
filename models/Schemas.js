var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    photoId: String,
    url: String,
    name: String,
    owner: String
});

var AlbumSchema = new Schema({
    name: String,
    photos: [String],
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

var UserSchema = new Schema(  {
    email: {type:String, unique:true},
    name: String,
    dropboxId: String,
});

module.exports = {
    "User": UserSchema,
    "Album": AlbumSchema,
    "Photo": PhotoSchema
};
