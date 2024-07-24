const connect = require('./connect.js');
let connection = connect.getConnectSql();

function setPage(user_id, msg, callback) {
    if (connection) {
        connection.query('INSERT INTO base_user_page (user_id, page_msg) VALUES (' + user_id + ', \'' + msg + '\');', (error, results, fields) => {
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

function editPage(id, u_id, msg, callback) {
    if (connection) {
        connection.query('UPDATE base_user_page SET page_msg=\'' + msg + '\' WHERE id=' + id + ' and user_id=' + u_id, (error, results, fields) => {
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

function getUserAllPage(user_id, callback) {
    if (connection) {
        connection.query('SELECT * FROM base_user_page where user_id=' + user_id, (error, results, fields) => {
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
function getPageInfo(id, callback) {
    if (connection) {
        connection.query('SELECT * FROM base_user_page where id=' + id, (error, results, fields) => {
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

module.exports.setPage = setPage;
module.exports.editPage = editPage;
module.exports.getUserAllPage = getUserAllPage;
module.exports.getPageInfo = getPageInfo;

module.exports.baseSql = baseSql;