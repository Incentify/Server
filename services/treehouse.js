const bluebird = require('bluebird');

module.exports.getUser = function(username) {
  return new Promise(function(resolve, reject) {
    express.get('https://teamtreehouse.com/' + username + '.json', function(req, res) {
      if (res.body) {
        resolve(res.body);
      } else {
        reject();
      }
    });
  });
}
