#!/usr/local/bin/node

var app = require('./app')
  , mongoose = require('mongoose');

mongoose.connect(app.credentials.mongodb.url);
console.log('Connected to MongoDB.');

app.start();
console.log("Server listening on port %d in %s mode.",
    app.port, app.settings.env);

