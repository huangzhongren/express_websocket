window.onload = function(){
    var mess = document.getElementById("mess");
    if (window.WebSocket) {
        var ws = new WebSocket('ws://localhost:8080');

        ws.onopen = function (e) {
            console.log("连接服务器成功");
            ws.send("game1");
        }
        ws.onclose = function (e) {
            console.log("服务器关闭");
        }
        ws.onerror = function () {
            console.log("连接出错");
        }

        ws.onmessage = function (e) {
            mess.innerHTML = "连接成功"
            console.log(e.data)
        }
    }
}
