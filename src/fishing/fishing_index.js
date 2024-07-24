const handleFishing = require('../common/handleFishing.js');
const handleUser = require('../common/handleUser.js');

function setFishing(app) {
    app.post('/fishing/add/detail', (req, res) => {
        const reData = req.body;

        if (reData && reData.token) {
            handleUser.getUserForToken(reData.token, (results) => {
                if (results && results.length > 0) {
                    const user = results[0];
                    handleFishing.setFishing(user.id, reData.msg, reData.address, (status) => {
                        if (status == 1) {
                            res.send({
                                status: 1,
                                msg: "成功",
                            });
                        } else {
                            res.send({
                                status: 0,
                                msg: "失败或无权限",
                            });
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: "用户信息错误",
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

function getFishingRandom(app) {
    app.get('/fishing/to/scoop', (req, res) => {
        if (req.query && req.query.token) {
            handleFishing.getFishingRandom((results) => {
                if (results) {
                    if (results.length > 0) {
                        const uid = results[0].user_id;
                        handleUser.getUserForId(uid, (users) => {
                            if (users && users.length > 0) {
                                const user = {
                                    ...users[0],
                                    token: ""
                                };
                                res.send({
                                    status: 1,
                                    data: {
                                        detail: (results || [])[0] || {},
                                        user,
                                    }
                                });
                            } else {
                                res.send({
                                    status: 1,
                                    data: {
                                        detail: (results || [])[0] || {},
                                        user: {},
                                    }
                                });
                            }
                        });
                    } else {
                        res.send({
                            status: 1,
                            data: {}
                        });
                    }
                } else {
                    res.send({
                        status: 0,
                        msg: "错误",
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

function getFishingForUser(app) {
    app.get('/fishing/get/list', (req, res) => {
        if (req.query && req.query.token) {
            console.log(req.query.token);
            handleUser.getUserForToken(req.query.token, (users) => {
                console.log(users);
                if (users && users.length > 0) {
                    const user = users[0];
                    handleFishing.getFishingForUser(user.id, (results) => {
                        if (results) {
                            results.reverse();
                            res.send({
                                status: 1,
                                data: {
                                    list: results || [],
                                    user,
                                }
                            });
                        } else {
                            res.send({
                                status: 0,
                                msg: "用户信息错误",
                            });
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: "用户信息错误",
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

function getFishingForId(app) {
    app.get('/fishing/get/detail', (req, res) => {
        if (req.query && req.query.id) {
            const id = parseInt(req.query.id + '');
            handlePage.getPageInfo(id, (results) => {
                if (results) {
                    const res = results[0] || {};
                    res.send({
                        status: 1,
                        data: {
                            detail: res
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: "数据错误",
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
    app.get('/fishing/base/sql', (req, res) => {
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
    setFishing(app);
    getFishingRandom(app);
    getFishingForId(app);
    getFishingForUser(app);

    baseSql(app);
    console.log('/fishing/ 服务启动成功');
}

module.exports.run = run;
