var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require('passport');
var treehouse = require('../services/treehouse');
var moment = require('moment');

var router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), function(request, response) {
      rdb.findBy('users', 'id', request.user.id)
        .then(function(users) {
          console.log(users);
            response.json(
              users.map(function(u) { return {
                email: u.email,
                id: u.id,
                username: u.commitments[0].username,

                goal_amount: u.commitments[0].goal_history[0].goal_amount,

                starting_points: u.commitments[0].goal_history[0].starting_point,

                value: u.commitments[0].point_history[0].value
              }})
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

router.put('/update', passport.authenticate('jwt', { session: false }), function(request, response) {
  rdb.find('users', request.user.id)
    .then(function(user) {
      //get new points
      treehouse.getUser(user.commitments[0].username).then(function (points) {
        //append those points
        var now = moment().format();
        var pointUpdate = {
          timestamp: now,
          value: points.points.total
        }
        rdb.appendPoints('users', user.id, pointUpdate);
      })
    });
});

module.exports = router;
