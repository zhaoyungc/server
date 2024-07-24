const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// 用户处理接口
const server_user = require('./src/user/user_index'); 
server_user.run(app);

// 页面处理接口
const server_page = require('./src/page/page_index.js'); 
server_page.run(app);

// 页面处理接口
const server_ad = require('./src/ad/ad_index.js'); 
server_ad.run(app);

// 页面处理接口
const server_fishing = require('./src/fishing/fishing_index.js'); 
server_fishing.run(app);

//第三方
const user_wx_login = require('./src/user/user_wx_login.js'); 
user_wx_login.run(app);

// 设置服务器监听的端口号
const port = process.env.PORT || 80
const server = app.listen(port);
server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
console.log('server started at 80');
