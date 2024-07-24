const axios = require('axios');
const handleUser = require('../common/handleUser.js');

// 渠道1是微信
function userLogin(app) {
    app.post('/user/wx/login', (req, res) => {
        const reData = req.body;
        if (reData.code) {
            axios.get('https://api.weixin.qq.com/sns/jscode2session', {
                params: {
                    appid: "wx1a9d4a67a4f66f64",//	string	是	小程序 appId
                    secret: "71332305117a166b80a52ea292a0f6e7", //	string	是	小程序 appSecret
                    js_code: reData.code, //	string	是	登录时获取的 code，可通过wx.login获取
                    grant_type: "authorization_code", //	string	是	授权类型，此处只需填写 authorization_code
                }
            }).then((response) => {
                const resData = response.data || {};
                if (resData.openid) {
                    handleUser.getUserForToken(resData.openid, (results) => {
                        if (results) {
                            if (results.length > 0) {
                                const my_user = results[0];
                                res.send({
                                    status: 1,
                                    data: {
                                        user: {
                                            ...my_user,
                                        },
                                    }
                                });
                            } else {
                                handleUser.setAutoUser(1, resData.openid, (results1) => {
                                    if (results1) {
                                        res.send({
                                            status: 1,
                                            data: {
                                                user: {
                                                    id: results1.insertId,
                                                    name: '',
                                                    token: resData.openid,
                                                    source: 1
                                                },
                                            }
                                        });
                                    } else {
                                        res.send({
                                            status: 0,
                                            msg: "登录失败",
                                        });
                                    }
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
                        msg: "错误",
                        resData,
                    });
                }
                
            }).catch(() => {
                res.send({
                    status: 0,
                    msg: "获取微信授权错误",
                });
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
    userLogin(app);
    console.log('/wx/ 服务启动成功');
}

module.exports.run = run;