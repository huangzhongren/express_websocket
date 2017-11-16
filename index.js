const express = require('express');
const http = require('http');
const qs = require('querystring');
const url = require('url');
const path = require('path');
const app = express();
const webSocket = require('ws');
const mongoose = require('mongoose')
app.engine('html',require('ejs').__express)
app.use(express.static(path.join(__dirname,'static')));
app.use(express.static(path.join(__dirname,'data')));
app.set('views','./static/views');
app.set('view engine','html');
app.use('/',require('./routes'));
const server = http.createServer(app);
const wss = new webSocket.Server({server});
wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    ws.on('message', function incoming(message) {
        var response = {},
            msg = JSON.parse(message);
        switch (msg.type){
            case 'read':
                var data = require('./data/bwic.json');
                response.id = msg.id;
                response.data = data;
                ws.send(JSON.stringify(response))
                break;
            case 'update':
                console.log('update')
                break;
            case 'create':
                console.log('create');
                response.id = msg.id;
                response.data = data;
                break;
            case 'destroy':
                console.log('destroy')
                break;
        }

    })
})
mongoose.connect('mongodb://localhost:27017/websocketdb',{useMongoClient:true},function(err){
    if(err){
        console.log(err)
        console.log('数据库连接失败')
    } else {
        console.log('连接成功')
        server.listen(8080, function listening() {
            console.log('Listening on %d', server.address().port);
        })
    }
})
