const handlePage = require('../common/handlePage.js');
const handleUser = require('../common/handleUser.js');

function setPage(app) {
    app.post('/page/add/detail', (req, res) => {
        const reData = req.body;

        if (reData && reData.token) {
            handleUser.getUserForToken(reData.token, (results) => {
                if (results && results.length > 0) {
                    const user = results[0];
                    if (reData.id) {
                        handlePage.editPage(reData.id, user.id, reData.msg, (status) => {
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
                        handlePage.setPage(user.id, "", (status) => {
                            if (status == 1) {
                                res.send({
                                    status: 1,
                                    msg: "成功",
                                });
                            } else {
                                res.send({
                                    status: 0,
                                    msg: "错误",
                                });
                            }
                        });
                    }
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

function getPageList(app) {
    app.get('/page/get/list', (req, res) => {
        if (req.query && req.query.token) {
            handleUser.getUserForToken(req.query.token, (results) => {
                if (results && results.length > 0) {
                    const user = results[0];
                    handlePage.getUserAllPage(user.id, (results) => {
                        if (results && results.length > 0) {
                            res.send({
                                status: 1,
                                data: {
                                    list: results.map((rel) => {
                                        return {
                                            id: rel.id,
                                        };
                                    }),
                                }
                            });
                        } else {
                            res.send({
                                status: 1,
                                data: {
                                    list: []
                                }
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

function getPageDetail(app) {
    app.get('/page/get/detail', (req, res) => {
        if (req.query && req.query.id) {
            const id = parseInt(req.query.id + '');
            handlePage.getPageInfo(id, (results) => {
                if (results && results.length > 0) {
                    res.send({
                        status: 1,
                        data: {
                            list: results,
                        }
                    });
                } else {
                    res.send({
                        status: 1,
                        data: { list: [] }
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
    app.get('/page/base/sql', (req, res) => {
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
    setPage(app);
    getPageList(app);
    getPageDetail(app);

    baseSql(app);
    console.log('/page/ 服务启动成功');
}

module.exports.run = run;
