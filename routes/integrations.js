var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require ('passport');

var router = express.Router();

// router.get('/', auth.authorize, function (request, response) {
router.get('/', function (request, response) {
    rdb.findAll('integrations')
    .then(function (integrations) {
        response.json(integrations);
    });
});

// router.get('/:id', auth.authorize, function (request, response, next) {
// router.get('/:id', function (request, response, next) {
//     rdb.find('users', request.params.id)
//     .then(function (user) {
//         if(!user) {
//             var notFoundError = new Error('User not found');
//             notFoundError.status = 404;
//             return next(notFoundError);
//         }

//         response.json(user);
//     });
// });

module.exports = router;