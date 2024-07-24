const handleAd = require('../common/handleAd.js');

function setAd(app) {
    app.post('/ad/add/detail', (req, res) => {
        const reData = req.body;
        if (reData && reData.img) {
            const img = reData.img;
            const page_url = reData.page_url || '';
            handleAd.setAd(page_url, img, (status) => {
                if (status == 1) {
                    res.send({
                        status: 1,
                        msg: "添加成功",
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
                msg: "参数错误",
            });
        }
    });
}

function onlineAd(app) {
    app.post('/ad/online/update', (req, res) => {
        const reData = req.body;
        if (reData && reData.id) {
            const id = reData.id;
            const stu = reData.status || 0;
            handleAd.onlineAd(id, stu, (status) => {
                if (status == 1) {
                    res.send({
                        status: 1,
                        msg: "更新成功",
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
                msg: "参数错误",
            });
        }
    });
}

function getAllOnlineAd(app) {
    app.get('/ad/online/list', (req, res) => {
        if (req.query && req.query.token) {
            handleAd.getAllOnlineAd((results) => {
                if (results) {
                    res.send({
                        status: 1,
                        data: {
                            list: results || [],
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: "失败",
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

function getAllAd(app) {
    console.log('接口');
    app.get('/ad/all/list', (req, res) => {
        console.log('进来了', req.query.token);
        if (req.query && req.query.token) {
            handleAd.getAllAd((results) => {
                if (results) {
                    res.send({
                        status: 1,
                        data: {
                            list: results || [],
                        }
                    });
                } else {
                    res.send({
                        status: 0,
                        msg: "失败",
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
    app.get('/ad/base/sql', (req, res) => {
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
    setAd(app);
    onlineAd(app);
    getAllOnlineAd(app);
    getAllAd(app);

    baseSql(app)
    console.log('/ad/ 服务启动成功');
}

module.exports.run = run;
