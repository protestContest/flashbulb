var should = require("should"),
    Album = require("../models/Album"),
    User = require("../models/User"),
    mongoose = require("mongoose");


describe("Album", function() {
    var testAlbum,
        testUser;

    before(function(done) {
        mongoose.connect("mongodb://localhost/album_test");
        User.remove({}, function(err) {
            Album.remove({}, done);
        });
    });

    after(function(done) {
        mongoose.disconnect();
        done();
    });

    beforeEach(function(done) {
        User.create({
            email: "testUser@example.com"
        }, function(err, user) {
            if (err) { done(err); }
            testUser = user;

            Album.create({
                user: testUser,
                name: "Test Album"
            }, function(err, album) {
                testAlbum = album;
                testUser.addAlbum(testAlbum, function() {
                    done(err);
                });
            });
        });
    });

    afterEach(function(done) {
        User.remove({}, function(err) {
            Album.remove({}, done);
        });
    });

    describe("#create", function() {
        it("should create an album with a name", function(done) {
            Album.create({ 
                name: "This Album"
            }, function(err, album) {
                should.exist(album);
                album.name.should.equal("This Album");
                album.photos.should.be.empty;
                done(err);
            });
        });

        it("should create a duplicate album that already exists", function(done) {
            Album.create({ 
                name: "Test Album"
            }, function(err, album) {
                should.exist(album);
                album.name.should.equal("Test Album");
                done(err);
            });
        });
    });

    describe("#get", function() {
        it("should get a album based on its id", function(done) {
            Album.get(testAlbum._id, function(err, album) {
                if (err) { console.log(err); }
                should.exist(album);
                album.name.should.equal("Test Album");
                done(err);
            });
        });

        it("should not get a album that doesn't exist", function(done) {
            Album.get("testUser@example.com", "Noalbum", function(err, album) {
                should.not.exist(album);
                should.exist(err);
                err.should.equal("album not found");
                done();
            });
        });

        it("should not get an album from a user that doesn't exist", function(done) {
            Album.get("noUser@example.com", "Test Album", function(err, album) {
                should.not.exist(album);
                should.exist(err);
                err.should.equal("user not found");
                done();
            });
        });
    });

    describe("#update", function() {
        it("should change a album's name", function(done) {
            testAlbum.update({ name: "New Name" }, function(err) {
                testAlbum.name.should.equal("New Name");
                done(err);
            });
        });

    });

    describe("#destroy", function() {
        it("should destroy a album", function(done) {
            testAlbum.destroy(function(destroyErr) {
                Album.findOne({"_id": testAlbum._id}, function(err, album) {
                    should.not.exist(album);
                    done(destroyErr);
                });
            });
        });
    });
});


