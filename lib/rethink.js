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


////////////
    module.exports.appendCommitment = function (tableName, id, arrayName, object) {
        return rdb.table(tableName).get(id)
        .update({commitments: rdb.row("commitments").append(object)}).run(connection)
        .then(function (result) {
            return result;
        });
    };

    module.exports.appendPoints = function (tableName, id, pointObj) {
        // return rdb.table(tableName)
        // .filter(r.row('id')
        // .eq(id))
        // .update({commitments: rdb.row})
        // .append()

        return rdb.table(tableName).get(id)
        .update({
            commitments: rdb
                            .row("commitments")
                            .filter(function(c) {
                                return c.service_name === 'Team Treehouse'
                            })[0]("point_history")
        })
        .append(pointObj)
        .run(connection)
        .then(function (result) {
            return result;
        });
    };

    ////////

    // DELETE/Delete queries
    module.exports.destroy = function (tableName, id) {
        return rdb.table(tableName).get(id).delete().run(connection)
        .then(function (result) {
            return result;
        });
    };
});