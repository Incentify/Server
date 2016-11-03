var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require('passport');
var treehouse = require('../services/treehouse');
var moment = require('moment');
var _ = require('lodash');

var router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), function(request, response) {
  rdb.findBy('users', 'id', request.user.id)
    .then(function(users) {
        response.json(
          users.map(function(u) {
              var base = {
                email: u.email,
                id: u.id
              };

              // should modify array prototype to have a .last method to avoid `u.commitments[0].goal_history.length -1` indexes
            if (u.commitments && u.commitments.length > 0) {
                base = _.merge(base, {
                  username: u.commitments[0].username,

                  goal_amount: u.commitments[0].goal_history[u.commitments[0].goal_history.length -1].goal_amount,

                  starting_points: u.commitments[0].goal_history[u.commitments[0].goal_history.length -1].starting_points,


                  value: u.commitments[0].point_history[u.commitments[0].point_history.length -1].value,

                  start: u.commitments[0].goal_history[u.commitments[0].goal_history.length -1].start_date,

                  end: u.commitments[0].goal_history[u.commitments[0].goal_history.length -1].end_date
                })
              }

              return base;
          })
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
      var userHasTeamTreehouseCommitment = _.some(user.commitments, function(c) {
        return c.service_name === 'treehouse';
      });
      if(user.commitments.length > 0 && userHasTeamTreehouseCommitment) {
        treehouse.getUser(user.commitments[0].username).then(function(points) {
          //append those points
          var now = moment().format();

          var pointUpdate = {
            timestamp: now,
            value: points.points.total
          }

          // rdb.appendPoints('users', user.id, pointUpdate).then(function (argument) {
          //   response.status(200);
          // });
          rdb.appendPoints('users', user.id, pointUpdate)
        })
      }
    });
});

module.exports = router;
