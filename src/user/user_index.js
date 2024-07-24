const handleUser = require('../common/handleUser.js');
const token = require('../common/token.js');

// 账号密码登录
function setUser(app) {
    app.post('/user/add/detail', (req, res) => {
        const reData = req.body;
        if (reData.user_name && reData.user_pass) {
            handleUser.getUserForName(reData.user_name, '', (results) => {
                if (results && results.length > 0) {
                    res.send({
                        status: 0,
                        msg: "用户名已存在",
                    });
                } else {
                    const newToken = token.getNewUserToken();
                    handleUser.setUser(reData.user_name, reData.user_pass, newToken, (results_1) => {
                        if (results_1) {
                            res.send({
                                status: 1,
                                data: {
                                    user: {
                                        id: results_1.insertId,
                                        name: reData.user_name,
                                        token: newToken
                                    },
                                }
                            });
                        } else {
                            res.send({
                                status: 0,
                                msg: "注册失败",
                            });
                        }
                    });
                }
            });
        } else {
            res.send({
                status: 0,
                msg: "参数错误",
            });
        }
    });
}

function updateUser(app) {
    app.post('/user/update/detail', (req, res) => {
        const reData = req.body;
        console.log("reData", reData);
        if (reData.token) {
            handleUser.getUserForToken(reData.token, (results) => {
                if (results && results.length > 0) {
                    const newData = results[0];
                    if (reData.hasOwnProperty('name')) {
                        newData.name = reData.name;
                    }
                    if (reData.hasOwnProperty('sex')) {
                        newData.sex = reData.sex;
                    }
                    if (reData.hasOwnProperty('weight')) {
                        newData.weight = reData.weight;
                    }
                    if (reData.hasOwnProperty('height')) {
                        newData.height = reData.height;
                    }
                    if (reData.hasOwnProperty('age')) {
                        newData.age = reData.age;
                    }
                    if (reData.hasOwnProperty('tel')) {
                        newData.tel = reData.tel;
                    }
                    if (reData.hasOwnProperty('email')) {
                        newData.email = reData.email;
                    }
                    if (reData.hasOwnProperty('address')) {
                        newData.address = reData.address;
                    }
                    console.log("newData", newData);
                    handleUser.updateUser(newData, (status)=> {
                        res.send({
                            status: status,
                            msg: "",
                        });
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: "用户名不存在",
                    });
                }
            });
        } else {
            res.send({
                status: 0,
                msg: "参数错误",
            });
        }
    });
}

function getUserForName(app) {
    app.get('/user/get/name/detail', (req, res) => {
        if (req.query && req.query.user_name && req.query.user_pass) {
            const user_name = req.query.user_name;
            const user_pass = req.query.user_pass;
            handleUser.getUserForName(user_name, user_pass, (results) => {
                if (results && results.length > 0) {
                    const my_user = results[0];
                    res.send({
                        status: 1,
                        data: {
                            user: {
                                ...my_user,
                                pass: '',
                            },
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: "账号或密码错误"
                    });
                }
            });
        } else {
            res.send({
                status: 0,
                msg: "错误",
            });
        }
    });
}

function getUserFortoken(app) {
    app.get('/user/get/token/detail', (req, res) => {
        if (req.query && req.query.token) {
            const mytoken = req.query.token;
            handleUser.getUserForToken(mytoken, (results) => {
                if (results && results.length > 0) {
                    const my_user = results[0];
                    res.send({
                        status: 1,
                        data: {
                            user: {
                                ...my_user,
                                pass: ''
                            },
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: 'token错误'
                    });
                }
            });
        } else {
            res.send({
                status: 0,
                msg: "参数错误",
            });
        }
    });
}

function getUserForId(app) {
    app.get('/user/get/id/detail', (req, res) => {
        if (req.query && req.query.id) {
            const id = req.query.id;
            handleUser.getUserForId(id, (results) => {
                if (results && results.length > 0) {
                    const my_user = results[0];
                    res.send({
                        status: 1,
                        data: {
                            user: {
                                ...my_user,
                                token: "",
                                pass: ''
                            },
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: 'id错误'
                    });
                }
            });
        } else {
            res.send({
                status: 0,
                msg: "参数错误",
            });
        }
    });
}

function baseSql(app) {
    app.get('/user/base/sql', (req, res) => {
        if (req.query && req.query.sql) {
            const sql = req.query.sql;
            handleUser.baseSql(sql, (results) => {
                if (results && results.length > 0) {
                    res.send({
                        status: 1,
                        data: {
                            results
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: 'sql错误'
                    });
                }
            });
        } else {
            res.send({
                status: 0,
                msg: "参数错误",
            });
        }
    });
}

function run(app) {
    setUser(app);
    updateUser(app);
    getUserForName(app);
    getUserFortoken(app);
    getUserForId(app);

    baseSql(app);
    console.log('/user/ 服务启动成功');
}

module.exports.run = run;