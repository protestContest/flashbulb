var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , mongoose = require('mongoose')
  , creds = require('../credentials').development
  ;

describe('Routing', function() {
  var url = 'http://127.0.0.1:3000';

  before(function(done) {
    mongoose.connect(creds.mongodb.url + 'test');
  });

  describe('User', function() {
    it('should create a non-existing user', function(done) {
      var body = {
        email: 'testUser1@flashbulb.com',
        name: 'Test User',
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
  });

});
