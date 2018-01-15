!function(root,$){
    var ws = null;
    var websocketApi = {
        connect:function(){
            if(typeof WebSocket === 'undefined'){
                $('body').html('该应用需要websocket支持，请升级您的浏览器。');
                return ;
            }
            var schema = location.protocol==='http:'?'ws:':'wss:';
            ws = new WebSocket(schema+'//localhost:8080');
        },
        listen: function(){
            ws.onopen = function(){
                root.connected = true;
                console.log(connected)
            };
            ws.onmessage = function(msg){
                var result = JSON.parse(msg.data);
                var grid = $('#grid').data('kendoGrid');
                //检查推送类型，执行响应的回调函数
                if (result.type === "push-update") {
                    grid.dataSource.pushUpdate(result);
                } else if (result.type === "push-destroy") {
                    grid.dataSource.pushDestroy(result);
                } else if (result.type === "push-create") {
                    grid.dataSource.pushCreate(result);
                }
            }
            window.onbeforeunloal = function(){
                ws.close()
            }
        },
        send: function(request,callback){
            if(ws.readyState!==1){
                alert('socket 断开链接，请尝试重新链接');
                return;
            }
            //Assign unique id to the request. Will use that to distinguish the response.
            request.id = kendo.guid();

            //监听message事件得到后台返回
            ws.addEventListener("message", function(e) {
                var result = JSON.parse(e.data);
                console.log(result)
                //Check if the response is for the current request
                if (result.id === request.id) {
                    ws.removeEventListener("message", arguments.callee);
                    if(result.type==='read'&&typeof callback === 'function'){
                        callback(result.data);
                    }
                }
            });
            //发送数据到服务器
            ws.send(JSON.stringify(request));
        }
    };
    var router = new kendo.Router({
        pushState:false,
        root:'/',
        routeMissing:function(e){
            this.navigate('index')
        }
    });
    router.route('login',function(){
        $('body').load('/login')
    });
    router.route('index',function(){
        $('body').load('/index')
    });

    root.router = router;
    root.ws = ws;
    root.websocketApi = websocketApi

}(this,jQuery);
$(function(){
    router.start();
    websocketApi.connect();
    websocketApi.listen()
});
