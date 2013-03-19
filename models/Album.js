var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    User = require("./User"),
    Photo = require("./Photo");

var AlbumSchema = new Schema({
    name: String,
    user: User,
    photos: [Photo]
});

// put methods here

mongoose.model("Album", AlbumSchema);
module.exports = mongoose.model("Album");
