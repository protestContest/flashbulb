var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    photoId: String,
    url: String,
    name: String,
    album: String
});

var AlbumSchema = new Schema({
    name: String,
    photos: [String],
    user: String
});

var UserSchema = new Schema(  {
    email: {type:String, unique:true},
    name: String,
    dropboxId: String,
    albums: [String]
});

module.exports = {
    "User": UserSchema,
    "Album": AlbumSchema,
    "Photo": PhotoSchema
};
