const router = require('express').Router();

router.get('/',function(req,res){
    res.render('index.html')
})

router.get('/spread',function(req,res){
    res.render('spreadsheet.html')
})
module.exports = router