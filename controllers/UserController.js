module.exports = function(creds) {
  var credentials = creds;

  return UserController;
};

// public API
var UserController = {
  getTags: function(req, res) {
    res.send(500);
  },

  getOne: function(req, res) {
    res.send(500);
  },

  getAll: function(req, res) {
    res.send(500);
  },

  createOrUpdate: function(req, res) {
    res.send(500);
  },

  destroy: function(req, res) {
    res.send(500);
  },

};
