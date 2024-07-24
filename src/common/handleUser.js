const connect = require('./connect.js');
let connection = connect.getConnectSql();

function setUser(name, pass, token, callback) {
    if (connection) {
        connection.query(
            'INSERT INTO base_user_info (name, pass, token) VALUES ("'+ name + '", "' + pass + '", "' + token+'");', 
            (error, results, fields) => {
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

function setAutoUser(source, token, callback) {
    if (connection) {
        connection.query(
            'INSERT INTO base_user_info (name, source, token) VALUES ("", ' + source + ', "' + token+'");', 
            (error, results, fields) => {
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

function updateUser(sqlData, callback) {
    if (connection) {
        connection.query(
            'UPDATE base_user_info SET '+
            'name=\'' + sqlData.name + '\', '+
            'sex=' + sqlData.sex + ', '+
            'weight=' + sqlData.weight + ', '+
            'height=' + sqlData.height + ', '+
            'age=' + sqlData.age + ', '+
            'tel=\'' + sqlData.tel + '\', '+
            'email=\'' + sqlData.email + '\', '+
            'address=\'' + sqlData.address + '\' '+
            'WHERE id=' + sqlData.id, (error, results, fields) => {
                console.log(error, results);
            if (error) {
                callback(0);
            } else if(results.changedRows > 0) {
                callback(1);
            } else {
                callback(0);
            }
        });
    } else {
        callback(null);
    }
}

function getUserForName(name, pass, callback) {
    if (connection) {
        let sql = 'SELECT * FROM base_user_info where name="' + name + '"';
        if (pass) {
            sql = 'SELECT * FROM base_user_info where name="' + name + '" and pass="' + pass + '"';
        }
        connection.query(sql, (error, results, fields) => {
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
function getUserForToken(token, callback) {
    if (connection) {
        connection.query('SELECT * FROM base_user_info where token="' + token + '"', (error, results, fields) => {
            console.log(error, results);
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

function getUserForId(id, callback) {
    if (connection) {
        connection.query('SELECT * FROM base_user_info where id=' + id, (error, results, fields) => {
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

module.exports.setUser = setUser;
module.exports.setAutoUser = setAutoUser;
module.exports.updateUser = updateUser;
module.exports.getUserForName = getUserForName;
module.exports.getUserForToken = getUserForToken;
module.exports.getUserForId = getUserForId;

module.exports.baseSql = baseSql;