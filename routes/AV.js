//-------настройка все что связанно с expess--------------------
const express = require('express');
var router = express.Router();
var app=express();
//-------SQL--------------------
const mysql = require("mysql2");
//-------config.json--------------------
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));


//---------------------
var isEmail=(req,res, next)=>{
  if(typeof req.session.email === 'undefined' || req.session.email === null){
    res.redirect('/');
  }
  else{
    return next();
  }
}

//---------------------------
const pool = mysql.createPool({
    connectionLimit: 500,
    queueLimit:300,
    waitForConnections:true,

    host: conf.connectionBD.host,
    user: conf.connectionBD.user,
    database: conf.connectionBD.database,
    password: conf.connectionBD.password
});
//---------------------------
router.get('/', function (req, res) {
    res.render("AV_email",{});
});

router.post('/', function (req, res) {
    pool.execute(conf.qBD.q1,[req.body.email],(err, results)=>{
    if(err){
          console.log(err);
          return res.render('AV_email',{data:"error"});
      }
     if(results.length==0){
        return res.render('AV_email',{data:"Такого пользователя нет"});
      }
      req.session.email=results[0].email;
      console.log(req.session.email);
      return res.redirect("AV/password");
    });
  });
  


router.get('/password',isEmail, function (req, res) {
    res.render("AV_password",{});
});

router.post('/password', function (req, res) {
  let data=[req.session.email,req.body.password];
   pool.execute(conf.qBD.q2,data,(err, results)=>{
    if(err){
        console.log(err);
        return res.render('AV_password',{data:"error"});
      }
    if(results.length==0){
        return res.render('AVS_password',{data:"неверный пароль"});
      }
      else{
        req.session.authorized=true;
        return res.redirect("/PersonalPage");
      }
      
  })          
});
//---------------------------

module.exports = router;