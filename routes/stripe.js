var express = require('express');
var app = express();
var dotenv = require('dotenv');
var bodyParser = require('body-parser');

dotenv.load(); //get configuration file from .env

var router = express.Router();

router.use(bodyParser.json());

var stripe = require("stripe")(process.env.sk_test_n8RGb6GbjIx5km3OkFHzbT4V);

router.get('/', function(req, res) {
    res.sendFile(__dirname +'index.html');
})

router.post('/process_payment', function(req, res) {
    var token_id = req.body.token_id;
    var purchase_price = req.body.price;
    //console.log(token.is +"\n"+ purchase_price)

    var charge = stripe.charges.create({
        amount: purchase_price, //amount in cents
        currency: "usd",
        source: token_id,
        description: "Example charge"
    }, function(err, charge){
        if (err && err.type === 'stripeCardError') {
            //The card has been declined
            res.json({"status":"failure", "reason":"card was declined"});
        }
        else{
            console.log(charge);
            res.json({"status":"success"});
        }
    });
})

module.exports = router;