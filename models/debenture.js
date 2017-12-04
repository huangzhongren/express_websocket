var monogoose = require('mongoose');

var debenSchema = new monogoose.Schema({
    client:String,
    dt:Date,
    tm:String,
    notes:String,
},{collection:'debentures'});

var debenModel = monogoose.model('Debenmodel',debenSchema);

module.exports = debenModel;