const express = require('express');
const http = require('http');
const url = require('url');
const logger = require('morgan')
const path = require('path');
const app = express();
const webSocket = require('ws');
const mongoose = require('mongoose')
app.engine('html',require('ejs').__express)
app.use(logger('dev'))
app.use(express.static(path.join(__dirname,'static')));
app.use(express.static(path.join(__dirname,'data')));
app.set('views','./static/views');
app.set('view engine','html');
app.use('/',require('./routes'));
const server = http.createServer(app);
const wss = new webSocket.Server({server});
var debenModel = require('./models/debenture');


function sendData(ws,msg){
    var response = {};
    debenModel.find().sort({'_id':-1}).then(function(rs){
        //将从前台接受的数据id再次放入响应数据，作为前台判断的唯一标识
        response.id = msg.id;
        response.data = rs;
        ws.send(JSON.stringify(response))
    })
}
wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    ws.on('message', function incoming(message) {
        var response = {},
            msg = JSON.parse(message);
        switch (msg.type){
            case 'read':
                sendData(ws,msg);
                break;
            case 'update':
                var _id = msg.data[0]['_id'];
                // console.log(_id)
                delete msg.data[0]['_id'];
                delete msg.data[0]['__v'];

                // console.log(msg.data[0])
                // debenModel.findByIdAndUpdate(_id,msg.data[0]).then(function(rs){
                //     console.log(rs)
                // })

                debenModel.findById(_id).then(function(rs){
                    var data = Object.assign(rs,msg.data[0]);
                    data.save().then(function(rs){
                        if(rs){
                            sendData(ws,msg)
                        }
                    })
                })
                break;
            case 'create':
                new debenModel(msg.data[0]).save().then(function(){
                    sendData(ws,msg)
                }).catch(function(err){
                    console.log(err)
                });
                break;
            case 'destroy':
                debenModel.remove(msg.data[0],function(){
                    sendData(ws,msg)
                })
                break;
        }

    })
});




mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ws_deben_system',{useMongoClient:true},function(err){
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
