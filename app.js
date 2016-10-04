var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
// secures some HTTP headers
var helmet = require('helmet');
require('dotenv').load();

// endpoints for database tables
var users = require('./routes/users');
var login = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// telling Express to use our routes
app.use('/users', users);
app.use('/login', login);

// sets error message for 500 status
app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    response.json({ error: error.message });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App is listening on http://%s:%s', host, port);
});