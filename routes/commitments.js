var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require('passport');
var moment = require('moment');
var treehouse = require('../services/treehouse');
// require duolingo service

var router = express.Router();

// user adds new TREEHOUSE commitment
router.put('/treehouse', passport.authenticate('jwt', { session: false }), function(request, response) {
  console.log("butts")
  rdb.find('users', request.user.id)
    .then(function(user) {

      // check if commitments has a commitment by that name
      for (var i = 0; i < user.length - 1; i++) {
        if (user[0].commitments[i].service_name === request.body.goal.integrationName) {
          return response.json("Cannot add a goal for an existing commitment.")
        }
      }

      //check if username exists
      // if yes, get their current total points
      treehouse.getUser(request.body.goal.username)
        .then(function(user) {
          // Create timestamp; use 168 hours to account for daylight savings
          var now = moment().format();
          var oneWeekLater = now.add(168, 'hours');

          // commitment objects 1 of 3
          var updateUser = {
            service_name: request.body.goal.integrationName,
            username: request.body.goal.username,
            stripe_token: null
          };

          // commitment objects 2 of 3
          var point_history = {
            timestamp: now,
            value: user_total_points
          }

          // commitment objects 3 of 3
          var goal_history = {
            start_date: now,
            end_date: oneWeekLater,
            starting_points: user_total_points,
            goal_amount: request.body.goal.pointGoal,
            penalty: request.body.goal.amount,
            renewable: true
          }

          rdb.edit('users', user.id, updateUser)
          .then(function(results) {
          // response.json(results);
            rdb.append('users', user.id, 'point_history', point_history)
            .then(function(results) {
              // response.json(results);
               rdb.append('users', user.id, 'goal_history', goal_history)
                .then(function(results) {
                  // response.json(results);
                  
                });
            });
          });

          return res.send(200);
        })
        .catch(function() {
          return res.json("That username was not valid, please check it and try again.");
        });
    });
});

// user adds new DUOLINGO commitment
router.put('/duolingo', passport.authenticate('jwt', { session: false }), function(request, response) {
  rdb.find('users', request.user.id)
    .then(function(user) {

      // check if commitments has a commitment by that name
      for (var i = 0; i < user.length - 1; i++) {
        if (user[0].commitments[i].service_name === request.body.goal.integrationName) {
          var message = "cannot add a goal for an existing commitment";
          return message;
        }
      }

      //check if username exists
      // if yes, get their current total points


      // Create timestamp; use 168 hours to account for daylight savings
      var now = moment().format();
      var oneWeekLater = now.add(168, 'hours');

      // commitment object
      var updateUser = {
        service_name: request.body.goal.integrationName,
        username: request.body.goal.username,
        stripe_token: null
      };

      rdb.append('users', user.id, updateUser)
        .then(function(results) {
          response.json(results);
        });
    });
});

module.exports = router;
