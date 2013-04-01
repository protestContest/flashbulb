var should = require("should"),
    Photo = require("../models/Photo"),
    Album = require("../models/Album"),
    User = require("../models/User"),
    mongoose = require("mongoose");


describe("Photo", function() {
    var testPhoto,
        testAlbum,
        testUser;

    before(function(done) {
        mongoose.connect("mongodb://localhost/photo_test");
        User.remove({}, function(err) {
            Album.remove({}, function(err) {
                Photo.remove({}, done);
            });
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

                Photo.create({
                    url: "/testPhoto.jpg"
                }, function(err, photo) {
                    testPhoto = photo;
                    done(err);
                });
            });
        });
    });

    afterEach(function(done) {
        User.remove({}, function(err) {
            Album.remove({}, function(err) {
                Photo.remove({}, done);
            });
        });
    });

    describe("#create", function() {
        it("should create an photo with a url", function(done) {
            Photo.create({ 
                url: "/photo.jpg"
            }, function(err, photo) {
                should.exist(photo);
                photo.photoId.should.equal("testUser@example.com:This Album/photo.jpg");
                done(err);
            });
        });

        it("should not create a photo that already exists", function(done) {
            Photo.create({ 
                url: "/testPhoto.jpg"
            }, function(err, photo) {
                should.not.exist(photo);
                should.exist(err);
                err.should.equal("photo exists");
                done();
            });
        });

        it("should create an photo for a different user with a duplicate name", function(done) {
            User.create({
                email: "differentUser@example.com"
            }, function(err, user) {
                Album.create({
                    user: user,
                    name: "Test Album"
                }, function(err, album) {
                    Photo.create({
                        url: "/testPhoto.jpg"
                    }, function(err, photo) {
                        should.exist(photo);
                        photo.photoId.should.equal("differentUser@example.com:Test Album/testPhoto.jpg");
                        done(err);
                    });
                });
            });
        });
    });

    describe("#get", function() {
        it("should get a album based on its albumId", function(done) {
            Photo.get("testUser@example.com:Test Album", function(err, album) {
                should.exist(album);
                album.name.should.equal("Test Album");
                done(err);
            });
        });

        it("should not get a album that doesn't exist", function(done) {
            Photo.get("nosuchalbum@example.com", function(err, album) {
                should.not.exist(album);
                should.exist(err);
                err.should.equal("album not found");
                done();
            });
        });
    });

    describe("#update", function() {
        it("should change a album's name", function(done) {
            testPhoto.update({ name: "New Name" }, function(err) {
                testPhoto.name.should.equal("New Name");
                testPhoto.user.email.should.equal("testUser@example.com");
                done(err);
            });
        });

        it("should change a album's name and user", function(done) {
            User.create({
                email: "newUser@example.com"
            }, function(err, newUser) {
                testPhoto.update({
                    name: "Newer Name",
                    user: newUser
                }, function(err) {
                    testPhoto.name.should.equal("Newer Name");
                    testPhoto.user.email.should.equal("newUser@example.com");
                    testPhoto.albumId.should.equal("newUser@example.com:Newer Name");
                    done(err);
                });
            });
        });
    });

    describe("#destroy", function() {
        it("should destroy a album", function(done) {
            testPhoto.destroy(function(destroyErr) {
                Photo.get(testPhoto.albumId, function(err, album) {
                    should.not.exist(album);
                    should.exist(err);
                    err.should.equal("album not found");
                    done(destroyErr);
                });
            });
        });
    });
});


