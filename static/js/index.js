$(function(){

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
            { field: "notes", title: "notes"},
            { field: "dt", title: "dt" },
            { field: "tm", title: "tm" },
            { command:'destroy',width:100}
        ],
        toolbar: [{template:'<a href="\\#" class="k-button" onclick="cus_addRow()">add new record</a>'}
            ,"destroy"
            ,{template:'<a href="\\#" class="k-button" onclick="cus_saveChanges()">save changes</a>'}
            ,"cancel"
        ,{template:'<span class="addrow"></span>'}],
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
                    // ws.addEventListener("message", function(e) {
                    //     var result = JSON.parse(e.data);
                    //     //检查推送类型，执行响应的回调函数
                    //     if (result.type === "push-update") {
                    //         options.pushUpdate(result);
                    //     } else if (result.type === "push-destroy") {
                    //         options.pushDestroy(result);
                    //     } else if (result.type === "push-create") {
                    //         options.pushCreate(result);
                    //     }
                    // });
                },
                //向后台发送read请求
                read: function(options) {
                    var request = { type: "read" };
                    websocketApi.send(request, function(result) {
                        options.success(result);
                    });
                },
                //向后台发送update请求
                update: function(options) {
                    var request = { type: "update", data: [options.data] };
                    websocketApi.send(request, options.success);
                },
                //向后台发送create请求
                create: function(options) {
                    var request = { type: "create", data: [options.data] };
                    websocketApi.send(request, options.success);
                },
                //向后台发送destroy请求
                destroy: function(options) {
                    var request = { type: "destroy", data: [options.data] };
                    websocketApi.send(request, options.success);
                }

            }
        },
        pageable: true,
        dataBound: function(){
            var rows = this.tbody.children('.k-master-row');
            this.expandRow(rows)
        }
    });
    var grid = $('#grid').data('kendoGrid');
    $(element).on('dblclick','tbody>tr>td',function(){
        grid.editCell($(this));
    })
    $(element).on('blur','tbody>tr>td',function(){
        grid.closeCell($(this));
    });
    $('.addrow').kendoButton({
        icon:'plus',
        click:function(){
            grid.addRow({})
        }
    });
    var timer = setInterval(function(){
        if(connected){
            clearInterval(timer);
            grid.dataSource.fetch(function(){
                console.log('success read')
            })
        }
    },200);
    //二级表格初始化
    function detailInit(e) {
        var parent_id = e.data.id;
        console.log(parent_id)
        // e.detailRow.append('<span class="k-column-btn"></span>');
        var detailele = $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: {
                transport: {
                    read: function(options) {
                        var request = {type:"read",super_id:parent_id};
                        websocketApi.send(request,options.success)
                    }
                },
                schema:{
                    model:{
                        id:"_id",
                        fields:{
                            "_id":{editable:false,nullable:true},
                            "notes":{type:'string'},
                            "color":{type:'string'}
                        }
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
                { field: "client", title: "client",width:80 },
                { field: "bond", title: "bond",width:80 },
                { field: "cusip", title: "cusip" ,width:80},
                { field: "of", title: "of" ,width:80},
                { field: "cap_charge", title: "cap_charge",width:80 },
                { field: "in_global_port", title: "in_global_port" ,width:80},
                { field: "px_type", title: "px_type",width:80 },
                { field: "bid", title: "bid",width:80},
                { field: "bidder", title: "bidder",width:80 },
                { field: "result", title: "result",width:80 },
                { field: "talk", title: "talk",width:80 },
                { field: "color", title: "color" ,width:80},
                { field: "notes", title: "notes",template:"<p class='tooltip' title='#: notes#'>#: notes #</p>" ,width:80},
                { field: "trdstk", title: "trdstk",width:80 },
                { field: "cvr", title: "cvr" ,width:80},
                { field: "bestbid", title: "bestbid" ,width:80},
                { field: "bestpx", title: "bestpx",width:80 },
                { field: "ask", title: "ask" ,width:80},
                { field: "bwic_result", title: "bwic_result",width:80 },
                { field: "calpx", title: "calpx",width:80 },
                { field: "md", title: "md",width:80 },
                { field: "wal", title: "wal",width:80 },
                { field: "yld", title: "yld" ,width:80},
                { field: "nspd", title: "nspd" ,width:80},
                { field: "espd", title: "espd",width:80 },
                { field: "jspd", title: "jspd",width:80 },
                { field: "cpnspd", title: "cpnspd",width:80 },
                { field: "vintage", title: "vintage",width:80 },
                { field: "number_of_assets", title: "number_of_assets",width:80 },
                { field: "tranche_bal", title: "tranche_bal",width:80 },
                { field: "factor", title: "factor" ,width:80},
                { field: "cpn", title: "cpn",width:80 },
                { field: "cpn_typ", title: "cpn_typ",width:80 },
                { field: "bond_credit_type", title: "bond_credit_type",width:80 },
                { field: "px_last", title: "px_last",width:80 },
                { field: "fitch", title: "fitch",width:80 },
                { field: "mdy", title: "mdy" ,width:80},
                { field: "sp", title: "sp",width:80 },
                { field: "dbrs", title: "dbrs" ,width:80},
                { field: "kbra", title: "kbra" ,width:80},
                { field: "morningstart", title: "morningstart" ,width:80},
                { field: "int_shrtfll_bond", title: "int_shrtfll_bond",width:80 },
                { field: "int_expect", title: "int_expect",width:80 },
                { field: "int_shrtfll", title: "int_shrtfll" ,width:80},
                { field: "senior_most_with_int_shrtfll", title: "senior_most_with_int_shrtfll",width:80 },
                { field: "senior_most_ce", title: "senior_most_ce",width:80 },
                { field: "senior_most_int_shrtfll_pct", title: "senior_most_int_shrtfll_pct",width:80 },
                { field: "ce", title: "ce",width:80 },
                { field: "thickness", title: "thickness",width:80 },
                { field: "ssfa_detach_point", title: "ssfa_detach_point",width:80 },
                { field: "defeased_pct", title: "defeased_pct",width:80 },
                { field: "def_adj_ce", title: "def_adj_ce" ,width:80},
                { field: "ce_after_ara", title: "ce_after_ara",width:80 },
                { field: "non_recov_amt", title: "non_recov_amt",width:80 },
                { field: "dlq30", title: "dlq30",width:80 },
                { field: "dlq60", title: "dlq60" ,width:80},
                { field: "dlq90", title: "dlq90" ,width:80},
                { field: "fcls", title: "fcls" ,width:80},
                { field: "reo", title: "reo" ,width:80},
                { field: "matured_nonperf_amt", title: "matured_nonperf_amt",width:80 },
                { field: "dbu", title: "dbu",width:80 },
                { field: "dba", title: "dba",width:80 },
                { field: "dbe", title: "dbe",width:80 },
                { field: "spec_svc_pct", title: "spec_svc_pct",width:80 },
                { field: "prop_type_top_1", title: "prop_type_top_1",width:80 },
                { field: "prop_type_top_2", title: "prop_type_top_2",width:80 },
                { field: "prop_type_top_3", title: "prop_type_top_3",width:80 },
                { field: "geo_1st_msa", title: "geo_1st_msa",width:80 },
                { field: "geo_2nd_msa", title: "geo_2nd_msa",width:80 },
                { field: "geo_3rd_msa", title: "geo_3rd_msa" ,width:80},
                { field: "spec_svc", title: "spec_svc" ,width:80},
                { field: "ssfa_secur_risk_wt_factor", title: "ssfa_secur_risk_wt_factor",width:80 },
                { field: "flt_spread", title: "flt_spread",width:80 },
                { field: "notesWithColor", title: "notesWithColor",template:"<span>#: color+notes #</span>",width:80}
            ],
            dataBound: function() {
                var that = this;
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
        e.detailRow.find('.tooltip').kendoTooltip()
    }

    window.cus_addRow = function(){
        grid.addRow()
    }
    window.cus_saveChanges = function(){
        grid.saveChanges()
    }
})