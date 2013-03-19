var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    User = require("./User");
    Album = require("./Album");

var PhotoSchema = new Schema({
    user: User,
    album: Album,
    url: String
});

// put methods here

mongoose.model("Photo", PhotoSchema);
module.exports = mongoose.model("Photo");
