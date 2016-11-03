var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require('passport');
var moment = require('moment');
var treehouse = require('../services/treehouse');
// require duolingo service

var router = express.Router();

// user adds new TREEHOUSE commitment
router.post('/treehouse', passport.authenticate('jwt', { session: false }), function(request, response) {

    rdb.find('users', request.user.id)
        .then(function(user) {

            // check if commitments has a commitment by that name
            if (user.commitments && user.commitments.length) {
                for (var i = 0; i < user.commitments.length; i++) {

                    if (user.commitments[i].service_name === "treehouse" && user.commitments[i].active) {

                        return response.status(400).json("Cannot add a goal for an existing commitment.")
                    }
                }
            }

            //check if username exists
            // if yes, get their current total points
            treehouse.getUser(request.body.username)
                .then(createCommitmentForTreehouseUser(request))
                .then(function resolveResults(results) {
                    response.json(results);
                })
                .catch(function(error) {
                    response.status(500).send(error);
                });
        });
});

// DUOLINGO NOT READY FOR DEMO
// user adds new DUOLINGO commitment
// router.put('/duolingo', passport.authenticate('jwt', { session: false }), function(request, response) {
//     rdb.find('users', request.user.id)
//         .then(function(user) {

//             // check if commitments has a commitment by that name
//             for (var i = 0; i < user.length - 1; i++) {
//                 if (user[0].commitments[i].service_name === request.body.goal.integrationName) {
//                     var message = "cannot add a goal for an existing commitment";
//                     return message;
//                 }
//             }

//             //check if username exists
//             // if yes, get their current total points


//             // Create timestamp; use 168 hours to account for daylight savings
//             var now = moment().format();
//             var oneWeekLater = now.add(168, 'hours');

//             // commitment object
//             var updateUser = {
//                 service_name: request.body.goal.integrationName,
//                 username: request.body.goal.username,
//                 stripe_token: null
//             };

//             rdb.append('users', user.id, updateUser)
//                 .then(function(results) {
//                     response.json(results);
//                 });
//         });
// });

///////////////////

function createCommitmentForTreehouseUser(request) {
    return function(teamTreehouseUser) {

        // Create timestamp; use 168 hours to account for daylight savings
        var now = moment();
        var oneWeekLater = moment().add(168, 'hours');

        var newCommitment = {
            service_name: "treehouse",
            username: request.body.username,
            stripe_token: null,
            active: true,
            point_history: [{
                timestamp: now.toDate(),
                value: teamTreehouseUser.points.total
            }],
            goal_history: [{
                start_date: now.toDate(),
                end_date: oneWeekLater.toDate(),
                starting_points: teamTreehouseUser.points.total,
                goal_amount: parseInt(request.body.pointGoal),
                penalty: request.body.amount,
                renewable: true
            }]
        };

        return rdb.appendCommitment('users', request.user.id, 'commitments', newCommitment);
    }
}


module.exports = router;
