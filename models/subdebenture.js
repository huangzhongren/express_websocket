var monogoose = require('mongoose');

var subDebenSchema = new monogoose.Schema({
    "debenture":{type:monogoose.Schema.Types.ObjectId,ref:'Debenmodel'},
    "client" : String,
    "bond" : String,
    "cusip" : String,
    "of" : Number,
    "cf" : Number,
    "cap_charge" : Number,
    "in_global_port" : String,
    "px_type" : String,
    "bid" : String,
    "bidder" : String,
    "result" : String,
    "talk" : String,
    "color" : String,
    "notes" : String,
    "trdstk" : String,
    "cvr" : String,
    "bestbid" : String,
    "bestpx" : String,
    "ask" : String,
    "bwic_result" : String,
    "calpx" : Number,
    "md" : Number,
    "wal" : Number,
    "yld" : Number,
    "nspd" : Number,
    "espd" : Number,
    "jspd" : Number,
    "cpnspd" : Number,
    "vintage" : Number,
    "bal" : Number,
    "number_of_assets" : Number,
    "tranche_bal" : Number,
    "factor" : Number,
    "cpn" : Number,
    "cpn_typ" : String,
    "bond_credit_type" :String,
    "px_last" : String,
    "fitch" : String,
    "mdy" : String,
    "sp" : String,
    "dbrs" : String,
    "kbra" : String,
    "morningstart" : String,
    "int_shrtfll_bond" : Number,
    "int_expect" : Number,
    "int_shrtfll" : Number,
    "senior_most_with_int_shrtfll" : String,
    "senior_most_ce" : Number,
    "senior_most_int_shrtfll_pct" : Number,
    "ce" : Number,
    "thickness" : Number,
    "ssfa_detach_point" : Number,
    "defeased_pct" : Number,
    "def_adj_ce" : Number,
    "ara" : Number,
    "ce_after_ara" : Number,
    "non_recov_amt" : Number,
    "dlq30" : Number,
    "dlq60" : Number,
    "dlq90" : Number,
    "fcls" : Number,
    "reo" : Number,
    "matured_nonperf_amt" : Number,
    "dbu" : Number,
    "dba" : Number,
    "dbe" : Number,
    "spec_svc_pct" : Number,
    "prop_type_top_1" : String,
    "prop_type_top_2" : String,
    "prop_type_top_3" : String,
    "geo_1st_msa" : String,
    "geo_2nd_msa" : String,
    "geo_3rd_msa" : String,
    "spec_svc" : String,
    "ssfa_secur_risk_wt_factor" : Number,
    "flt_spread" : Number
},{collection:'subdebentures'});

var subDebenModel = monogoose.model('SubDebenModel',subDebenSchema);

module.exports = subDebenModel;