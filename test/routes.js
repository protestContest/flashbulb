var should = require('should')
  , assert = require('assert')
  , request = require('supertest')
  , mongoose = require('mongoose')
  , creds = require('credentials').development
  ;

describe('Routing', function() {
  var url = 'http://google.com';

  before(function(done) {
    mongoose.connect(creds.mongodb.url);
  });



});
