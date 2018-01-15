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
var subdebenModel = require('./models/subdebenture');

function sendData(ws,msg,query){
    var response = {};
    switch (msg.type) {
        case 'read':
            response.type = 'read';
            break;
        case 'update':
            response.type = 'push-update';
            break;
        case 'create':
            response.type = 'push-create';
            break;
        case 'destroy':
            response.type = 'push-destroy';
            break;
    }
    subdebenModel.find(query).then(function(rs){
        if(rs){
            response.id = msg.id;
            response.data = rs;
            ws.send(JSON.stringify(response))
        }
    })
}
function sendSuperData(ws,msg,query){
    var response = {};
    switch (msg.type) {
        case 'read':
            response.type = 'read';
            break;
        case 'update':
            response.type = 'push-update';
            break;
        case 'create':
            response.type = 'push-create';
            break;
        case 'destroy':
            response.type = 'push-destroy';
            break;
    }
    debenModel.find(query,{bwicitems:0}).then(function(rs){
        if(rs){
            response.id=msg.id;
            response.data = rs;
            ws.send(JSON.stringify(response))
        }
    })
}
wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    ws.on('message', function incoming(message) {
        var msg = JSON.parse(message);
        if(msg.super_id){//修改二级table
            switch (msg.type){
                case 'read':
                    sendData(ws,msg,{debenture:msg.super_id});
                    break;
                case 'update':
                    var _id = msg.data._id;
                    subdebenModel.update({_id:_id},msg.data).then(function(rs){
                        if(rs){
                            // console.log(rs)
                            // sendData(ws,msg,{_id:_id});
                        }
                    })
                    break;
                case 'create':
                    break;
                case 'destroy':
            }
        }else if(msg.hasOwnProperty('super_id')){
            console.log(1)
            ws.send(JSON.stringify({id:msg.id,data:[]}))
        }else{
            switch (msg.type){
                case 'read':
                    sendSuperData(ws,msg,{});
                    break;
                case 'update':
                    var _id = msg.data[0]['_id'];
                    debenModel.update({_id:_id},msg.data[0]).then(function(rs){
                        if(rs){
                            sendSuperData(ws,msg,{_id:_id});
                        }
                    })
                    break;
                case 'create':
                    // new debenModel(msg.data[0]).save().then(function(){
                    //     sendSuperData(ws,msg)
                    // }).catch(function(err){
                    //     console.log(err)
                    // });
                    break;
                case 'destroy':
                    // debenModel.remove(msg.data[0],function(){
                    //     sendSuperData(ws,msg)
                    // })
                    break;
            }
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
