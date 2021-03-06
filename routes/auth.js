var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var token = require('../lib/token');

var router = express.Router();

router.post('/login',
  function(req, res) {
    rdb.findBy('users', 'email', req.body.email)
      .then(
        function(users) {
          switch (users.length) {
            case 0:
              return res.sendStatus(400); // couldn't find an email
            case 1:
              auth.authenticate(req.body.password, users[0].password).then(
                function(user) {
                  // generate the token
                  var accessToken = token.generate(users[0]);

                  res.send({
                    token: accessToken,
                    email: user.email
                  });
                }
              );
              break;
            default:
              return res.send(500); // duplicate email
              break;
          }
        }
      )
      .catch(
        function(error) {
          return res.send(500);
          done(error, null);
        }
      );
  });

router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.password &&
    req.body.confirmPassword) {

    // confirm that user typed same password twice
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    //query to see if req.body.email already exists
    rdb.findBy('users', 'email', req.body.email).then(function(result) {
      // make sure email isn't already in database
      if (result.length) {
        var err = new Error('That email is already taken');
        err.status = 400;
        return next(err);
      }

      // hash the password
      auth.hash_password(req.body.password)
        .then(function(hash) {
          // create object with form input
          var userData = {
            email: req.body.email,
            password: hash,
            commitments: []
          };

          rdb.save('users', userData)
            .then(function(result) {
              rdb.findBy('users', 'email', req.body.email).then(function(users) {
                var jwtToken = token.generate(users[0]);

                res.send({
                  success: true,
                  message: 'User successfully created',
                  token: jwtToken
                })
              });
            });
        })

    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

module.exports = router;
