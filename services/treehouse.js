const Promise = require('bluebird');
const request = require('request');

// gets user object from Team Treehouse API
module.exports.getUser = function(username) {
    return new Promise(function(resolve, reject) {
        request('https://teamtreehouse.com/' + username + '.json', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
            	reject()
            }
        });
    });
}
