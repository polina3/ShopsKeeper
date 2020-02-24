//-------настройка все что связанно с expess--------------------
const express = require('express');
var router = express.Router();
var app=express();
//-------SQL--------------------
const mysql = require("mysql2");
//-------config.json--------------------
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('./config.json'));
//---------------------------
var P_END=(pool)=>{
  pool.end((err)=>{
    if (err) {
      console.log(err.message);
    }
    console.log("пул закрыт");
  });
}
//---------------------------
var isEmail=(req,res, next)=>{
  if(req.session.email='' || !req.session.email){
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
    res.render("index_email",{});
});

router.post('/', function (req, res) {
    pool.execute(conf.qBD.q1,[req.body.email],(err, results)=>{
    if(err){
          console.log(err);
          return res.render('index_email',{data:"error"});
      }
     if(results.length==0){
        console.log("-e");
        return res.render('index_email',{data:"Такого пользователя нет"});
      }
      req.session.email=results[0].email;
      res.redirect("/password");
    });
  });
  


router.get('/password',isEmail, function (req, res) {
    res.render("index_password",{});
});

router.post('/password', function (req, res) {
  let data=[req.session.email,req.body.password];
   pool.execute(conf.qBD.q2,data,(err, results)=>{
    if(err){
        console.log(err);
        return res.render('index_password',{data:"error"});
      }
    if(results.length==0){
        return res.render('index_password',{data:"неверный пароль"});
      }
    res.send("Ok");
  })          
});
//---------------------------

module.exports = router;