const Promise = require('bluebird');
const request = require('request');

module.exports.getUser = function(username) {
  console.log(username);
    return new Promise(function(resolve, reject) {
      console.log("parsing treehouse");
        request('https://teamtreehouse.com/' + username + '.json', function(error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log("ok, treehouse username exists");
                resolve(JSON.parse(body));
            } else {
              console.log("no treehouse username matches");
            	reject()
            }
        });
    });
}
