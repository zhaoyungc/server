const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '10.40.106.67', // 数据库服务器地址
    user: 'deploy', // 数据库用户名
    password: 'Gaoxing123#!',
    database: 'my_data',
    connectTimeout: 5000,
});

let isconnected = false;
connection.connect(function (error) {
    if (error) {
        return;
    }
    isconnected = true;
});

function getConnectSql() {
    if (isconnected) {
        return connection;
    }
    return null;
}

module.exports.getConnectSql = getConnectSql;