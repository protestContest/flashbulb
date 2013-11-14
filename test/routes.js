var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , mongoose = require('mongoose')
  , app = require('../app')
  , fixtures = require('../fixtures')
  ;

describe('Routing', function() {
  var url = 'http://127.0.0.1:3000';

  before(function(done) {
    mongoose.connect(app.credentials.mongodb.url);
    app.start();
    done();
  });

  beforeEach(function(done) {
    console.log(fixtures);
    fixtures.run();
    done();
  });

  describe('User', function() {
    it('should create a non-existing user', function(done) {
      var body = {
        email: 'testUser1@flashbulb.com',
        name: 'New Test User',
        dropboxId: '234873567'
      };

      request(url)
          .put('/api/users/testuser1')
          .send(body)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            res.body.should.have.property('_id');
            res.body.email.should.equal(body.email);
            res.body.name.should.equal(body.name);
            res.body.dropboxId.should.equal(body.dropboxId);
            done();
          });
    });

    it('should update an existing user', function(done) {
      var body = {
        username: 'test1',
        email: 'test1@example.com',
        name: 'Different Name',
        dropboxId: '00000000'
      };

      request(url)
          .put('/api/users/test1')
          .send(body)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            res.body.should.have.property('_id');
            res.body.email.should.equal(body.email);
            res.body.name.should.equal(body.name);
            res.body.dropboxId.should.equal(body.dropboxId);
            done();
          });
    });

    it('should remove an existing user', function(done) {
      request(url)
          .get('/api/users/test1')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {

        if (err) { throw err; }
        res.body.should.have.property('_id');
        res.body.email.should.have.property(body.email);
        res.body.name.should.have.property(body.name);
        res.body.dropboxId.should.have.property(body.dropboxId);
        request(url)
            .delete('/api/users/test1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {

          if (err) { throw err; }
          res.body.should.not.have.property('_id');
          done();

        });
      });
    });
  });

});
