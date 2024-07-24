const connect = require('./connect.js');
let connection = connect.getConnectSql();

function setFishing(user_id, msg, now_address, callback) {
    if (connection) {
        connection.query('INSERT INTO base_user_fishing (user_id, msg, now_address) VALUES (' + user_id + ', \'' + msg + '\', \'' + now_address + '\');', (error, results, fields) => {
            if (error) {
                callback(0);
            } else {
                callback(1);
            }
        });
    } else {
        callback(0);
    }
}

function getFishingForUser(user_id, callback) {
    if (connection) {
        connection.query('SELECT * FROM base_user_fishing where user_id=' + user_id, (error, results, fields) => {
            if (error) {
                callback(null);
            } else {
                callback(results);
            }
        });
    } else {
        callback(null);
    }
}
function getFishingForId(id, callback) {
    if (connection) {
        connection.query('SELECT * FROM base_user_fishing WHERE id=' + id, (error, results, fields) => {
            if (error) {
                callback(null);
            } else {
                callback(results);
            }
        });
    } else {
        callback(null);
    }
}

function getFishingRandom(callback) {
    if (connection) {
        connection.query('SELECT * FROM base_user_fishing ORDER BY RAND() LIMIT 1;', (error, results, fields) => {
            if (error) {
                callback(null);
            } else {
                callback(results);
            }
        });
    } else {
        callback(null);
    }
}

function baseSql(sqlStr, callback) {
    if (connection) {
        connection.query(sqlStr, (error, results, fields) => {
            if (error) {
                callback(null);
            } else {
                callback(results);
            }
        });
    } else {
        callback(null);
    }
}

module.exports.setFishing = setFishing;
module.exports.getFishingForId = getFishingForId;
module.exports.getFishingRandom = getFishingRandom;
module.exports.getFishingForUser = getFishingForUser;

module.exports.baseSql = baseSql;