$(function(){
    $('.spreadsheet').kendoSpreadsheet({
        toolbar:false,
        sheets:[
        {
            rows:[
                {
                    height:30,
                    cells:[
                        {value:"Date"},
                    ]
                },
                {
                    height:30,
                    cells:[
                        {value:"Time"},
                    ]
                }
            ],
            columns:[
                {width: 100},
                {width: 100},
                {width: 100},
                {width: 100},
            ]

        }],
        columns:5,
        change: function(e){
            console.log(e)
            var val = e.range.value();
            var row = e.range._ref.bottomRight.row;
            var col = e.range._ref.bottomRight.col;
            var nextRow =  spreadSheet.activeSheet().range(row+1,col)
            // nextRow.format('HH:mm:ss');
            // nextRow.validation({
            //     dataType:'Time',
            //     comparer:''
            // })
        },
    })
    var spreadSheet = $('.spreadsheet').data('kendoSpreadsheet');
    $('.exportTojson').kendoButton({
        icon:'upload',
        click:function(){//export json data
            var sheet = spreadSheet.activeSheet();
            var rows = sheet._rows._count;
            var cols = sheet._columns._count;
            var values = sheet.range('A1:C'+rows).values(),
                len = values.length;
            var bwic = {};
            var data = [];
            for(var i=0;i<len;i++){
                var rowVal = values[i];
                if(typeof rowVal[0]==='number' && rowVal[0]>1){//date
                    if(bwic.date && bwic.date!==rowVal[0]){
                        console.log(bwic)
                        data.push(bwic)
                    }
                    bwic = {date : rowVal[0]}
                }
                if(typeof rowVal[0]==='number' && rowVal[0]<1){//time
                    if(typeof bwic.date==='undefined'){
                        //todo handle invalid data
                    }else {
                        if(bwic.time && bwic.time!==rowVal[0]){
                            data.push(bwic)
                        }
                        bwic.time = rowVal[0];
                        bwic.client = rowVal[1];
                        bwic.notes = rowVal[2];
                        bwic.bwicitems = [];
                    }
                }
                if(typeof rowVal[0]==='string'){
                    if(typeof bwic.time==='undefined'){
                        //todo
                    }else {
                        var bwicitem = {bond:rowVal[0]};
                        bwicitem.size = rowVal[1];
                        bwicitem.bidConv = rowVal[2];
                        bwic.bwicitems.push(bwicitem)
                        // console.log(bwic)
                    }
                }
                if(i===len-1){
                    data.push(bwic)
                }
            }
            setTimeout(function(){
                console.log(data)
            },200)
        }
    })
})