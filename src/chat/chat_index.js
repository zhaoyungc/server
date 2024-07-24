

const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8877,
});

const handleUser = require('../common/handleUser.js');

// 用户id标识，
const all_user = {}; // 所有用户的历史消息
const connect_list = {}; // 当前连接上的所有人. key为标识

function sendMsg(ws, msg_data) {
    const msgStr = JSON.stringify({
        ...msg_data,
        time: new Date().getTime(),
    });
    if (ws) {
        ws.send(msgStr);
    }
}

//接收： 0验证登录用户token, 10消息
//发送： 0系统消息，1连接成功，9历史消息，10消息
wss.on('connection', function connection(ws) {
    let catchUserId = '';
    ws.on('message', function incoming(message) {
        const msgData = JSON.parse(message);
        if (msgData.type == '0') {
            if (msgData.token_id) {
                handleUser.getUserForToken(msgData.token_id, (results) => {
                    if (results && results.length > 0) {
                        const user = results[0];
                        catchUserId = user.id;
                        connect_list['user_' + user.id] = {
                            user: {
                                id: user.id,
                                name: user.name,
                            },
                            ws: ws,
                        };
                        sendMsg(ws, {
                            type: '1'
                        });
                        // 以下发送历史消息
                        if (all_user['user_' + user.id]) {
                            const list = all_user['user_' + user.id].list || [];
                            if (list.length > 0) {
                                sendMsg(ws, {
                                    type: '9',
                                    list: list,
                                });
                                all_user['user_' + user.id].list = [];
                            }
                        } else {
                            all_user['user_' + user.id] = {
                                user: {
                                    id: user.id,
                                    name: user.name,
                                },
                                list: []
                            };
                        }
                    } else {
                        sendMsg(ws, {
                            type: '0',
                            msg: '用户错误'
                        });
                    }
                });
            } else {
                sendMsg(ws, {
                    type: '用户数据缺失',
                });
            }
        } else if (msgData.type == "10") {
            if (msgData.to_user_id) {
                if (connect_list['user_' + catchUserId]) {
                    sendMsg((connect_list['user_' + catchUserId] || {}).ws, {
                        type: '10',
                        ...msgData,
                        send_user: all_user['user_' + catchUserId].user,
                        to_user: all_user['user_' + msgData.to_user_id].user,
                    });
                }
                if (connect_list['user_' + msgData.to_user_id]) {
                    sendMsg((connect_list['user_' + msgData.to_user_id] || {}).ws, {
                        type: '10',
                        ...msgData,
                        send_user: all_user['user_' + catchUserId].user,
                        to_user: all_user['user_' + msgData.to_user_id].user,
                    });
                } else {
                    sendMsg(ws, {
                        type: '0',
                        message: '对方不在线'
                    });
                    if (all_user['user_' + msgData.to_user_id]) {
                        all_user['user_' + msgData.to_user_id].list.push(
                            {
                                type: '10',
                                ...msgData,
                                send_user: all_user['user_' + catchUserId].user,
                                to_user: all_user['user_' + msgData.to_user_id].user,
                            }
                        );
                    }

                }
            } else {
                for (const key in connect_list) {
                    if (Object.hasOwnProperty.call(connect_list, key)) {
                        const element = connect_list[key] || {};
                        sendMsg(element.ws, {
                            type: '10',
                            ...msgData,
                            send_user: all_user['user_' + catchUserId].user,
                        });
                    }
                }
            }
        }
    });
    ws.on('close', function close(e) {
        if (catchUserId && connect_list['user_' + catchUserId]) {
            delete connect_list['user_' + catchUserId];
        }
    });

    ws.on('error', function error(e) {
        sendMsg(ws, {
            type: '0',
            message: '连接出错出现异常'
        });
    });
});
console.log('聊天室 启动成功');