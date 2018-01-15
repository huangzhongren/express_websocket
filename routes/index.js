const router = require('express').Router();

router.get('/',function(req,res){
    res.render('common.html')
})

router.get('/spread',function(req,res){
    res.render('spreadsheet.html')
});
router.get('/login',function(req,res){
    res.render('login.html')
});
router.get('/index',function(req,res){
    res.render('index.html')
});

module.exports = router