var express = require('express');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_test_n8RGb6GbjIx5km3OkFHzbT4V');
var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var passport = require ('passport');


var router = express.Router();

router.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = 1000;
    stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            res.send(500, err);
        } else {
            res.send(204);
        }
    });
});

module.exports = router;