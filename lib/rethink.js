var rdb = require('rethinkdb');
var dbConfig = require('../config/databases');

var connection = rdb.connect(dbConfig)
.then(function (connection) {
    // GET/READ queries
    module.exports.find = function (tableName, id) {
        return rdb.table(tableName).get(id).run(connection)
        .then(function (result) {
            return result;
        });
    };

    module.exports.findAll = function (tableName) {
        return rdb.table(tableName).run(connection)
        .then(function (cursor) {
            return cursor.toArray();
        });
    };

    module.exports.findBy = function (tableName, fieldName, value) {
        return rdb.table(tableName).filter(rdb.row(fieldName).eq(value)).run(connection)
        .then(function (cursor) {
            return cursor.toArray();
        });
    };

    module.exports.findIndexed = function (tableName, query, index) {
        return rdb.table(tableName).getAll(query, { index: index }).run(connection)
        .then(function (cursor) {
            return cursor.toArray();
        });
    };

    // POST/Create queries
    module.exports.save = function (tableName, object) {
        return rdb.table(tableName).insert(object).run(connection)
        .then(function (result) {
            return result;
        });
    };

    // PUT/Update queries
    module.exports.edit = function (tableName, id, object) {
        return rdb.table(tableName).get(id).update(object).run(connection)
        .then(function (result) {
            return result;
        });
    };

    module.exports.append = function (tableName, id, arrayName, object) {
        return rdb.table(tableName).get(id)
        .update({commitments: rdb.row("commitments").append(object)}).run(connection)
        .then(function (result) {
            return result;
        });
    };

    module.exports.appendCommitment = function (tableName, id, arrayName, object) {
        return rdb.table(tableName).get(id)
        .update({commitments: rdb.row("commitments").append(object)}).run(connection)
        .then(function (result) {
            return result;
        });
    };

// THIS FUNCTION WAS SUPER HARD TO FIGURE OUT.
// appending values to an array within an object, within an array within an object
    module.exports.appendPoints = function(tableName, id, pointObj) {
        rdb.db("incentify").table("users").get(id).update(function(user) {
             return {
                commitments: user('commitments').map(function(commitment) {
                    return commitment.merge({
                        point_history: commitment('point_history').append(pointObj)
                    })
                })
            }
        }).run(connection)
        .then(function (result) {
            console.log("successfully wrote");
            return result;
        });
    }

    // DELETE/Delete queries
    module.exports.destroy = function (tableName, id) {
        return rdb.table(tableName).get(id).delete().run(connection)
        .then(function (result) {
            return result;
        });
    };
});
