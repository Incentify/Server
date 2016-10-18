var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var rethink = require('./rethink');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
      return done(null, user.id)
  });

  passport.deserializeUser(function (id, done) {
    rethink.find('users', id)
    .then(function(user){
      if(user){
          done(null, user);
      }else{
          done("Could not find user", null);
      }
    })
    .catch(function (error) {
      done(error, null);
    })
  });

  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = process.env.TOKEN_SECRET;
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    rethink.find('users', jwt_payload.sub)
    .then(function(user){
      if(user){
          done(null, user);
      }else{
          done("Could not find user", null);
      }
    })
    .catch(function (error) {
      done(error, null);
    })
  }))
}