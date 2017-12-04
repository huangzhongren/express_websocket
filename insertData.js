var DebenModel = require('./models/debenture')
var SubdebenModel = require('./models/subdebenture')

var subbenData = require('./data/subdeben.json')

var benData = require('./data/deben.json')

var mongoose = require('mongoose')

mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost:27017/ws_deben_system',{useMongoClient:true},function(err){
    if(err){
        console.log(err)
        console.log('数据库连接失败')
    } else {
        console.log('连接成功');
        for(var i = 0;i<benData.length;i++){
            (function(i){
                new DebenModel(benData[i]).save(function(err,rs){
                    for(var j = 0;j<subbenData[i].length;j++){
                        var subdeben = new SubdebenModel(subbenData[i][j]);
                        subdeben.debenture = rs;
                        subdeben.save(function(err,rs){
                            console.log(rs)
                        })
                    }
                });
            })(i)
            // deben.save().then(function(rs){
            //     console.log(rs)
            // })
        }
    }
})

