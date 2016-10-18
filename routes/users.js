var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require ('passport');

var router = express.Router();

// router.get('/', auth.authorize, function (request, response) {
router.get('/', function (request, response) {
    rdb.findAll('users')
    .then(function (users) {
        response.json(users);
    });
});

// router.get('/:id', auth.authorize, function (request, response, next) {
router.get('/:id', function (request, response, next) {
    rdb.find('users', request.params.id)
    .then(function (user) {
        if(!user) {
            var notFoundError = new Error('User not found');
            notFoundError.status = 404;
            return next(notFoundError);
        }

        response.json(user);
    });
});

router.post('/', function (request, response) {
    auth.hash_password(request.body.password)
    .then(function (hash) {
        var newUser = {
            email: request.body.email,
            password: hash
        };

        rdb.save('users', newUser)
        .then(function (result) {
            response.json(result);
        });
    });
});

router.put('/', passport.authenticate('jwt', { session: false }), function (request, response) {
    rdb.findBy('users', 'id', request.user.id)
    .then(function (user) {

        // add new password validiation
        // add unique email validation
        var updateUser = {
            email: request.body.email || user.email,
            password: request.body.password || user.password
        };

        rdb.edit('user', user.id, updateUser)
        .then(function (results) {
            response.json(results);
        });
    });
});

// do we allow users to delete accounts or not?
// router.delete('/:id', passport.authenticate('jwt', { session: false }), function (request, response) {
//     rdb.destroy('users', request.params.id)
//     .then(function (results) {
//         response.json(results);
//     });
// });

module.exports = router;