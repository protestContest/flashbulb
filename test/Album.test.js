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
                done(err);
            });
        });
    });

    afterEach(function(done) {
        Album.remove({}, done);
    });

    describe("#create", function() {
        it("should create an album with a user email and name", function(done) {
            Album.create({ 
                user: testUser,
                name: "This Album"
            }, function(err, album) {
                should.exist(album);
                album.user.email.should.equal("testUser@example.com");
                album.name.should.equal("This Album");
                album.albumId.should.equal("testUser@example.com:This Album");
                album.photos.should.be.empty;
                done(err);
            });
        });

        it("should not create a album that already exists", function(done) {
            Album.create({ 
                user: testUser,
                name: "Test Album"
            }, function(err, album) {
                should.not.exist(album);
                should.exist(err);
                err.should.equal("album exists");
                done();
            });
        });

        it("should create an album for a different user with a duplicate name", function(done) {
            User.create({
                email: "differentUser@example.com"
            }, function(err, user) {
                Album.create({
                    user: user,
                    name: "Test Album"
                }, function(err, album) {
                    should.exist(album);
                    album.user.email.should.equal("differentUser@example.com");
                    album.name.should.equal("Test Album");
                    album.albumId.should.equal("differentUser@example.com:Test Album");
                    done(err);
                });
            });
        });
    });

    describe("#get", function() {
        it("should get a album based on its albumId", function(done) {
            Album.get("testUser@example.com:Test Album", function(err, album) {
                should.exist(album);
                album.name.should.equal("Test Album");
                done(err);
            });
        });

        it("should not get a album that doesn't exist", function(done) {
            Album.get("nosuchalbum@example.com", function(err, album) {
                should.not.exist(album);
                should.exist(err);
                err.should.equal("album not found");
                done();
            });
        });
    });

    describe("#update", function() {
        it("should change a album's name", function(done) {
            testAlbum.update({ name: "New Name" }, function(err) {
                testAlbum.name.should.equal("New Name");
                testAlbum.email.should.equal("testAlbum@example.com");
                done(err);
            });
        });

        it("should change a album's name and email", function(done) {
            testAlbum.update({
                name: "Newer Name",
                email: "newemail@example.com"
            }, function(err) {
                testAlbum.name.should.equal("Newer Name");
                testAlbum.email.should.equal("newemail@example.com");
                done(err);
            });
        });
    });

    describe("#destroy", function() {
        it("should destroy a album", function(done) {
            testAlbum.destroy(function(destroyErr) {
                Album.get(testAlbum.email, function(err, album) {
                    should.not.exist(album);
                    should.exist(err);
                    err.should.equal("album not found");
                    done(destroyErr);
                });
            });
        });
    });
});


