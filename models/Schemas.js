var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    photoId: String,
    url: String,
    name: String
});

var AlbumSchema = new Schema({
    name: String,
    photos: [PhotoSchema]
});

var UserSchema = new Schema(  {
    email: {type:String, unique:true},
    name: String,
    dropboxId: String,
    albums: [AlbumSchema]
});

module.exports = {
    "User": UserSchema,
    "Album": AlbumSchema,
    "Photo": PhotoSchema
};
