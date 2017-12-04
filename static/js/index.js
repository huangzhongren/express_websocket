

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
                if(result.type==='read'&&typeof callback === 'function'){
                    callback(result.data);
                }
            }
        });
        //发送数据到服务器
        ws.send(JSON.stringify(request));
    }



    $("#notification").kendoNotification({
        width: "100%",
        position: {
            top: 0,
            left: 0
        }
    });
    var element = $("#grid").kendoGrid({
        autoBind: false,
        sortable: true,
        columns: [
            { field: "client", title: "client" },
            { field: "notes", title: "notes" },
            { field: "dt", title: "dt" },
            { field: "tm", title: "tm" },
            { command:'destroy',width:100}
        ],
        toolbar: [{template:'<a href="\\#" class="k-button" onclick="cus_addRow()">add new record</a>'}
            ,"destroy"
            ,{template:'<a href="\\#" class="k-button" onclick="cus_saveChanges()">save changes</a>'}
            ,"cancel"],
        detailInit: detailInit,
        dataSource: {
            // Handle the push event to display notifications when push updates arrive
            //当数据源接收到一个推送通知或者pushCreate、pushUpdate、pushDestroy被调用时触发
            push: function(e) {
                console.log(e)
                var notification = $("#notification").data("kendoNotification");
                notification.success(e.type);
            },
            //每改变一次页面数据都会触发transport.update
            pageSize: 10,
            schema: {
                model: {
                    id: "_id",//必须对应数据源中数据对应的id,否则每次更改数据源只触发transport.create，很玄学！
                    fields: {
                        "_id": { editable: false, nullable: true },
                        "client": { type: "string"},
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
                //向后台发送read请求
                read: function(options) {
                    var request = { type: "read" };
                    send(ws, request, function(result) {
                        options.success(result);
                    });
                },
                //向后台发送update请求
                update: function(options) {
                    var request = { type: "update", data: [options.data] };
                    send(ws, request, options.success);
                },
                //向后台发送create请求
                create: function(options) {
                    var request = { type: "create", data: [options.data] };
                    send(ws, request, options.success);
                },
                //向后台发送destroy请求
                destroy: function(options) {
                    var request = { type: "destroy", data: [options.data] };
                    send(ws, request, options.success);
                }

            }
        },
        pageable: true,
    });
    var grid = $('#grid').data('kendoGrid');
    $(element).on('dblclick','tbody>tr>td',function(){
        grid.editCell($(this));
    })
    $(element).on('blur','tbody>tr>td',function(){
        grid.closeCell($(this));
    })
    //二级表格初始化
    function detailInit(e) {
        var parent_id = e.data.id;
        e.detailRow.append('<span class="k-column-btn"></span>');
        var detailele = $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: {
                transport: {
                    read: function(options) {
                        var request = {type:"read",super_id:parent_id};
                        send(ws,request,options.success)
                    }
                },
                pageSize: 5,
            },
            save:function(e){
                console.log(e.model.cap_charge)
                console.log(e.model)
                var request = {
                    type:"update",
                    data:e.model,
                    super_id:parent_id
                }
                send(ws,request,function(){})
            },
            resizable: true,
            scrollable: true,
            // toolbar:[{template:'<a href="\\#" class="k-button grid-column-menu fa fa-columns" onclick="cus_columnMenu()">manage columns</a>'},'create'],
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
        $('#popup').kendoPopup({
            anchor:e.detailRow.find('.k-column-btn'),
            origin:"center right",
            position:"-70px left",
            animation:{
                effects:"zoom in"
            }
        })
        var popup = $('#popup').data('kendoPopup');
        var detailGrid = $(detailele).data('kendoGrid');
        var field_template = kendo.template($('#field-template').html());
        $('#popup').html(field_template(detailGrid.columns))
        e.detailRow.find('.k-column-btn').kendoButton({
            icon:'columns',
            click:function(){
               popup.open()
            }
        })

        // e.detailRow.find('.k-i-columns').kendoMenu({
        //     dataSource:[{
        //         items:menuDs
        //     }],
        //     openOnClick: true,
        //     closeOnClick: false,
        //     open: function () {
        //         var selector;
        //         // deselect hidden columns
        //         $.each(detailGrid.columns, function () {
        //             console.log(this)
        //             if (this.hidden) {
        //                 selector = "input[data-field='" + this.field + "']";
        //                 $(selector).prop("checked", false);
        //             }
        //         });
        //     },
        //     select: function (e) {
        //         // ignore click on top-level menu button
        //         if ($(e.item).parent().filter("div").length) return;
        //
        //         var input = $(e.item).find("input.check");
        //         var field = $(input).data("field");
        //         if ($(input).is(":checked")) {
        //             detailGrid.showColumn(field);
        //         } else {
        //             detailGrid.hideColumn(field);
        //         }
        //     }
        // })
    }

    window.cus_addRow = function(){
        grid.addRow()
    }
    window.cus_saveChanges = function(){
        grid.saveChanges()
    }
})