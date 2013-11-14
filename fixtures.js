var User = require('./models/User.js')
  ;

exports.run = function() {
  var users = [
      {
        username: 'test1',
        email: 'test1@example.com',
        name: 'Test User1',
        dropboxId: '1234567'
      },
      {
        username: 'test2',
        email: 'test2@example.com',
        name: 'Test User2',
        dropboxId: '7654321'
      }
    ];

  users.forEach(function(user) {
    User.create(user);
  });
};

