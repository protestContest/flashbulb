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
                    url: "/testPhoto.jpg",
                    album: testAlbum
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
                url: "/photo.jpg",
                album: testAlbum
            }, function(err, photo) {
                should.exist(photo);
                photo.photoId.should.equal("testUser@example.com:Test Album/photo.jpg");
                done(err);
            });
        });

        it("should not create a photo that already exists", function(done) {
            Photo.create({ 
                url: "/testPhoto.jpg",
                album: testAlbum
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
                        url: "/testPhoto.jpg",
                        album: album
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
        it("should get a photo based on its photoId", function(done) {
            Photo.get("testUser@example.com:Test Album/testPhoto.jpg", function(err, photo) {
                should.exist(photo);
                photo.url.should.equal("/testPhoto.jpg");
                done(err);
            });
        });

        it("should not get a photo that doesn't exist", function(done) {
            Photo.get("testUser@example.com:Test Album/nophoto.jpg", function(err, photo) {
                should.not.exist(photo);
                should.exist(err);
                err.should.equal("photo not found");
                done();
            });
        });
    });

    describe("#update", function() {
        it("should change a photo's url", function(done) {
            testPhoto.update({ url: "/newUrl.jpg" }, function(err) {
                testPhoto.url.should.equal("/newUrl.jpg");
                testPhoto.album.name.should.equal("Test Album");
                done(err);
            });
        });

        it("should change a photo's url and album", function(done) {
            Album.create({
                user: testUser,
                name: "New Album"
            }, function(err, newAlbum) {
                testPhoto.update({
                    url: "/newLocation.jpg",
                    album: newAlbum
                }, function(err) {
                    testPhoto.url.should.equal("/newLocation.jpg");
                    testPhoto.album.name.should.equal("New Album");
                    testPhoto.photoId.should.equal("testUser@example.com:New Album/newLocation.jpg");
                    done(err);
                });
            });
        });
    });

    describe("#destroy", function() {
        it("should destroy a photo", function(done) {
            testPhoto.destroy(function(destroyErr) {
                Photo.get(testPhoto.photoId, function(err, photo) {
                    should.not.exist(photo);
                    should.exist(err);
                    err.should.equal("photo not found");
                    done(destroyErr);
                });
            });
        });
    });
});


