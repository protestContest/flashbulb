var should = require("should"),
    User = require("../models/User");

describe("User", function() {
    var testUser;

    beforeEach(function(done) {
        User.create({
            email: "testUser@example.com",
            name: "Test User",
            dropboxId: "12345"
        }, function(err, user) {
            testUser = user;
            done(err);
        });
    });

    afterEach(function(done) {
        User.remove({}, done);
    });

    describe("#create", function() {
        it("should create a user with an email", function(done) {
            User.create({ email: "test@example.com" }, function(err, user) {
                should.exist(user);
                user.email.should.equal("test@example.com");
                user.should.not.have("name");
                user.should.not.have("dropboxId");
                user.albums.should.be.empty();
                done(err);
            });
        });

        it("should create a user with an email, name, and dropboxId", function(done) {
            User.create({ 
                email: "test@example.com",
                name: "John Doe",
                dropboxId: "42"
            }, function(err, user) {
                should.exist(user);
                user.email.should.equal("test@example.com");
                user.
                user.should.not.have("dropboxId");
                user.albums.should.be.empty();
                done(err);
            });
        });

        it("should not create a user that already exists", function(done) {
            User.create({ email: "testUser@example.com" }, function(err, user) {
                should.not.exist(user);
                should.exist(err);
                err.should.equal("user exists");
                done();
            });
        });
    });

    describe("#get", function() {
        it("should get a user based on its email", function(done) {
            User.get("testUser@example.com", function(err, user) {
                should.exist(user);
                user.name.should.equal("Test User");
                done(err);
            });
        });

        it("should not get a user that doesn't exist", function(done) {
            User.get("nosuchuser@example.com", function(err, user) {
                should.not.exist(user);
                should.exist(err);
                err.should.equal("user not found");
                done();
            });
        });
    });

    describe("#update", function() {
        it("should change a user's name", function(done) {
            testUser.update({ name: "New Name" }, function(err) {
                testUser.name.should.equal("New Name");
                testUser.email.should.equal("testUser@example.com");
                done(err);
            });
        });

        it("should change a user's name and email", function(done) {
            testUser.update({
                name: "Newer Name",
                email: "newemail@example.com"
            }, function(err) {
                testUser.name.should.equal("Newer Name");
                testUser.email.should.equal("newemail@example.com");
                done(err);
            });
        });
    });

    describe("#destroy", function() {
        it("should destroy a user", function(done) {
            testUser.destroy(function(err) {
                should.not.exist(testUser);
                done(err);
            });
        });
    });
});