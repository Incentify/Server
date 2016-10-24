var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require('passport');
var moment = require('moment');

var router = express.Router();

// user adds new TREEHOUSE commitment
router.put('/treehouse', passport.authenticate('jwt', { session: false }), function(request, response) {
  rdb.find('users', request.user.id)
    .then(function(user) {

      // check if commitments has a commitment by that name
      for (var i = 0; i < user.length - 1; i++) {
        if(user[0].commitments[i].service_name === request.body.goal.integrationName){
          //CHANGE ME CHANGE ME CHANGE ME CHANGE ME CHANGE ME CHANGE ME 
          // add a actual message
          var message = "cannot add a goal for an existing commitment";
          return message;
        }
      }

      //add error message for no users with that ID

      //check if username exists
      // if yes, get their current total points
      var integrationRequest;
      if(window.XMLHttpRequest){
        integrationRequest = new XMLHttpRequest();
      }else{
        integrationRequest = new ActiveXObject("Microsoft.XMLHTTP");
        integrationRequest.open('GET', 'https://teamtreehouse.com/' + request.body.goal.username + '.json', false);
        integrationRequest.send();
      }

      if (integrationRequest.status === 200) {
          //CHANGE ME CHANGE ME CHANGE ME CHANGE ME CHANGE ME CHANGE ME 
          // add a actual message
          var user_total_points = integrationRequest.body.points.total;
          // return a message
      }else{
        // return error message
      }

      // Create timestamp; use 168 hours to account for daylight savings
      var now = moment().format();
      var oneWeekLater = now.add(168, 'hours');

      // commitment objects 1, 2, and 3
      var updateUser = {
        service_name: request.body.goal.integrationName,
        username: request.body.goal.username,
        stripe_token: null
      };

      var point_history = {
        timestamp: now,
        value: user_total_points
      }

      var goal_history = {
        start_date: now,
        end_date: oneWeekLater,
        starting_points: user_total_points,
        goal_amount: request.body.goal.pointGoal,
        penalty: request.body.goal.amount,
        renewable: true
      }

      rdb.append('users', user.id, updateUser)
        .then(function(results) {
          response.json(results);
        });
    });
});

// user adds new DUOLINGO commitment
router.put('/duolingo', passport.authenticate('jwt', { session: false }), function(request, response) {
  rdb.find('users', request.user.id)
    .then(function(user) {

      // check if commitments has a commitment by that name
      for (var i = 0; i < user.length - 1; i++) {
        if(user[0].commitments[i].service_name === request.body.goal.integrationName){
          var message = "cannot add a goal for an existing commitment";
          return message;
        }
      }

      //check if username exists
      // if yes, get their current total points
      var integrationRequest;
      if(window.XMLHttpRequest){
        integrationRequest = new XMLHttpRequest();
      }else{
        integrationRequest = new ActiveXObject("Microsoft.XMLHTTP");
        integrationRequest.open('GET', 'https://www.duolingo.com/users/' + request.body.goal.username, false);
        integrationRequest.send();
      }

      if (integrationRequest.status === 404) {
          console.log("The user account you provided does not exist.");
      }

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
