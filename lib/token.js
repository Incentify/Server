var jwt = require('jwt-simple');
var moment = require('moment');
var secret = process.env.TOKEN_SECRET;

// 1 year timer because we may as well check if it's them once in awhile, plus big updates will most likely come more frequently than that
module.exports.generate = function (user) {
    var expires = moment().add(365, 'days').valueOf();
    return jwt.encode({ sub: user.id, exp: expires }, secret);
};

module.exports.verify = function (token, next) {
    if(!token) {
        var notFoundError = new Error('Token not found');
        notFoundError.status = 404;
        return next(notFoundError);
    }

    if(jwt.decode(token, secret) <= moment().format('x')) {
        var expiredError = new Error('Token has expired');
        expiredError.status = 401;
        return next(expiredError);
    }
};