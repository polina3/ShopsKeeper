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
var IsEmail=(atr)=>{
    pool.execute(conf.qBD.q1,atr,(err,results)=>{
    if(err){
          console.log(err);
          return false;
      }
    if(results.length!=0){
        return false;
      }  
    return true;
  })
}
//---------------------------
router.get('/', function (req, res) {
    res.render("reg",{});
});

router.post('/', function (req, res) {
    
    if(IsEmail(req.body.email);){
      let atr=[req.body.email,req.body.password,req.body.tel,req.body.surname,req.body.name,req.body.t_name,req.body.date,req.body.gender];
      pool.execute(conf.qBD.S_k,atr,(err, results)=>{
      if(err){
            console.log(err);
            return res.render('reg',{data:"error"});
        }
        res.send('OK');
      })   
    }
    else{
      res.render('reg',{data:"Такой пользователь уже есть"});
    }
    
     
});



//---------------------------

module.exports = router;