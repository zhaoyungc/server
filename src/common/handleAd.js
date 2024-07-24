const connect = require('./connect.js');
let connection = connect.getConnectSql();

function setAd(page_url, img, callback) {
    if (connection) {
        connection.query('INSERT INTO base_ad (img, page_url) VALUES (\'' + img + '\', \'' + page_url + '\');', (error, results, fields) => {
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

function onlineAd(id, status, callback) {
    if (connection) {
        connection.query('UPDATE base_ad SET online=' + status + ' WHERE id=' + id, (error, results, fields) => {
            if (error) {
                callback(0);
            } else if(results.changedRows > 0) {
                callback(1);
            } else {
                callback(0);
            }
        });
    } else {
        callback(0);
    }
}

function getAllOnlineAd(callback) {
    if (connection) {
        connection.query('SELECT * FROM base_ad where online=1', (error, results, fields) => {
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
function getAllAd(callback) {
    if (connection) {
        connection.query('SELECT * FROM base_ad', (error, results, fields) => {
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

module.exports.setAd = setAd;
module.exports.onlineAd = onlineAd;
module.exports.getAllOnlineAd = getAllOnlineAd;
module.exports.getAllAd = getAllAd;

module.exports.baseSql = baseSql;