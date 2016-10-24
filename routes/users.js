var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require('passport');

var router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), function(request, response) {
      rdb.findBy('users', 'id', request.user.id)
        .then(function(users) {
            response.json(
              users.map(function(u) { return {email: u.email, id: u.id} })
            );
        });
    });

router.post('/', function(request, response) {
  auth.hash_password(request.body.password)
    .then(function(hash) {
      var newUser = {
        email: request.body.email,
        password: hash
      };

      rdb.save('users', newUser)
        .then(function(result) {
          response.json(result);
        });
    });
});

router.put('/', passport.authenticate('jwt', { session: false }), function(request, response) {
  console.log(request.user);
  rdb.find('users', request.user.id)
    .then(function(user) {
      // add new password validiation
      // add unique email validation
      var updateUser = {
        email: request.body.email || user.email,
        password: request.body.password || user.password
      };

      rdb.edit('users', user.id, updateUser)
        .then(function(results) {
          response.json(results);
        });
    });
});

module.exports = router;
