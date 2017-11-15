const express = require('express');
const http = require('http');
const url = require('url');
const path = require('path');
const app = express();
const webSocket = require('ws');
app.engine('html',require('ejs').__express)
app.use(express.static(path.join(__dirname,'static')));
app.set('views','./static/views');
app.set('view engine','html');
app.use('/',require('./routes'));
const server = http.createServer(app);
const wss = new webSocket.Server({server});
wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    ws.on('message', function incoming(message) {
        console.log('receive: %s', message)
    })
    ws.send('something')
})

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
})