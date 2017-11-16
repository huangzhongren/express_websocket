

$(function(){
    if(typeof WebSocket === 'undefined'){
        $('#grid').html('该应用需要websocket支持，请升级您的浏览器。')
        return
    }
    //实例化websocket
    var ws = new WebSocket('ws://localhost:8080');
    //链接websocket时绑定grid
    ws.onopen = function(){
        //向远程服务器发送请求，拉取数据，返回一个promise,支持callback参数
        $('#grid').data('kendoGrid').dataSource.fetch(function(){
            // console.log(this.data())
        });
    }
    window.onbeforeunload = function(){
        ws.close();
    }
    function send(ws,request,callback){
        if(ws.readyState!==1){
            alert('socket 断开链接，请尝试重新链接');
            return;
        }
        //Assign unique id to the request. Will use that to distinguish the response.
        request.id = kendo.guid();

        //监听message事件得到后台返回
        ws.addEventListener("message", function(e) {
            var result = JSON.parse(e.data);
            //Check if the response is for the current request
            if (result.id === request.id) {
                ws.removeEventListener("message", arguments.callee);
                callback(result.data);
            }
        });
        //发送数据到服务器
        ws.send(JSON.stringify(request));
    }

    //二级表格初始化
    function detailInit(e) {
        $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: {
                transport: {
                    read: function(options) {
                        options.success(e.data.bwicitems.toJSON());
                    }
                },
                pageSize: 5,
            },
            resizable: true,
            scrollable: true,
            sortable: true,
            columns: [
                { field: "client", title: "client" },
                { field: "bond", title: "bond" },
                { field: "cusip", title: "cusip" },
                { field: "of", title: "of" },
                { field: "cap_charge", title: "cap_charge" },
                { field: "in_global_port", title: "in_global_port" },
                { field: "px_type", title: "px_type" },
                { field: "bid", title: "bid" },
                { field: "bidder", title: "bidder" },
                { field: "result", title: "result" },
                { field: "talk", title: "talk" },
                { field: "color", title: "color" },
                { field: "notes", title: "notes" },
                { field: "trdstk", title: "trdstk" },
                { field: "cvr", title: "cvr" },
                { field: "bestbid", title: "bestbid" },
                { field: "bestpx", title: "bestpx" },
                { field: "ask", title: "ask" },
                { field: "bwic_result", title: "bwic_result" },
                { field: "calpx", title: "calpx" },
                { field: "md", title: "md" },
                { field: "wal", title: "wal" },
                { field: "yld", title: "yld" },
                { field: "nspd", title: "nspd" },
                { field: "espd", title: "espd" },
                { field: "jspd", title: "jspd" },
                { field: "cpnspd", title: "cpnspd" },
                { field: "vintage", title: "vintage" },
                { field: "number_of_assets", title: "number_of_assets" },
                { field: "tranche_bal", title: "tranche_bal" },
                { field: "factor", title: "factor" },
                { field: "cpn", title: "cpn" },
                { field: "cpn_typ", title: "cpn_typ" },
                { field: "bond_credit_type", title: "bond_credit_type" },
                { field: "px_last", title: "px_last" },
                { field: "fitch", title: "fitch" },
                { field: "mdy", title: "mdy" },
                { field: "sp", title: "sp" },
                { field: "dbrs", title: "dbrs" },
                { field: "kbra", title: "kbra" },
                { field: "morningstart", title: "morningstart" },
                { field: "int_shrtfll_bond", title: "int_shrtfll_bond" },
                { field: "int_expect", title: "int_expect" },
                { field: "int_shrtfll", title: "int_shrtfll" },
                { field: "senior_most_with_int_shrtfll", title: "senior_most_with_int_shrtfll" },
                { field: "senior_most_ce", title: "senior_most_ce" },
                { field: "senior_most_int_shrtfll_pct", title: "senior_most_int_shrtfll_pct" },
                { field: "ce", title: "ce" },
                { field: "thickness", title: "thickness" },
                { field: "ssfa_detach_point", title: "ssfa_detach_point" },
                { field: "defeased_pct", title: "defeased_pct" },
                { field: "def_adj_ce", title: "def_adj_ce" },
                { field: "ce_after_ara", title: "ce_after_ara" },
                { field: "non_recov_amt", title: "non_recov_amt" },
                { field: "dlq30", title: "dlq30" },
                { field: "dlq60", title: "dlq60" },
                { field: "dlq90", title: "dlq90" },
                { field: "fcls", title: "fcls" },
                { field: "reo", title: "reo" },
                { field: "matured_nonperf_amt", title: "matured_nonperf_amt" },
                { field: "dbu", title: "dbu" },
                { field: "dba", title: "dba" },
                { field: "dbe", title: "dbe" },
                { field: "spec_svc_pct", title: "spec_svc_pct" },
                { field: "prop_type_top_1", title: "prop_type_top_1" },
                { field: "prop_type_top_2", title: "prop_type_top_2" },
                { field: "prop_type_top_3", title: "prop_type_top_3" },
                { field: "geo_1st_msa", title: "geo_1st_msa" },
                { field: "geo_2nd_msa", title: "geo_2nd_msa" },
                { field: "geo_3rd_msa", title: "geo_3rd_msa" },
                { field: "spec_svc", title: "spec_svc" },
                { field: "ssfa_secur_risk_wt_factor", title: "ssfa_secur_risk_wt_factor" },
                { field: "flt_spread", title: "flt_spread" }
            ],
            dataBound: function() {
                var that = this;
                $.each(this.columns, function(index) {
                    that.autoFitColumn(index);
                })
            }
        });
    }

    $("#notification").kendoNotification({
        width: "100%",
        position: {
            top: 0,
            left: 0
        }
    });
    $("#grid").kendoGrid({
        autoBind: false,
        editable: true,
        sortable: true,
        columns: [
            { field: "client", title: "client" },
            { field: "notes", title: "notes" },
            { field: "dt", title: "dt" },
            { field: "tm", title: "tm" },
            { command:'destroy',width:100}
        ],
        toolbar: ["create","destroy","save","cancel"],
        detailInit: detailInit,
        dataSource: {
            // Handle the push event to display notifications when push updates arrive
            //当数据源接收到一个推送通知或者pushCreate、pushUpdate、pushDestroy被调用时触发
            push: function(e) {
                var notification = $("#notification").data("kendoNotification");
                notification.success(e.type);
            },
            autoSync: true,
            pageSize: 10,
            //暂时还不明白schema
            schema: {
                model: {
                    id: "shareID",
                    fields: {
                        "shareID": { editable: false, nullable: true },
                        "client": { type: "string",validation:{require:true} },
                        "notes": { type: "string" },
                        "dt": { type: "string" },
                        "tm": { type: "time" }
                    }
                },
            },
            transport: {
                push: function(options) {
                    //服务器推送数据时，监听message事件
                    ws.addEventListener("message", function(e) {
                        var result = JSON.parse(e.data);
                        //检查推送类型，执行响应的回调函数
                        if (result.type === "push-update") {
                            options.pushUpdate(result);
                        } else if (result.type === "push-destroy") {
                            options.pushDestroy(result);
                        } else if (result.type === "push-create") {
                            options.pushCreate(result);
                        }
                    });
                },
                read: function(options) {
                    var request = { type: "read" };
                    send(ws, request, function(result) {
                        options.success(result);
                    });
                },
                update: function(options) {
                    var request = { type: "update", data: [options.data] };
                    send(ws, request, options.success);
                },
                destroy: function(options) {
                    console.log(options.data)
                    var request = { type: "destroy", data: [options.data] };
                    send(ws, request, options.success);
                },
                create: function(options) {
                    var request = { type: "create", data: [options.data] };
                    send(ws, request, options.success);
                }
            }
        },
        pageable: true,
    });

})