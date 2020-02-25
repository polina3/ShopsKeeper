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
var IsEmail=async (atr)=>{
  let a=[atr];
  console.log("в IsEmail");
  await pool.execute(conf.qBD.q1,a,(err,results)=>{
    if(err){
      console.log(1);
      console.log(err);
      return false;
    }
    if(results.length!=0){
      console.log(2);
      return false;
      }  
      console.log("ok");
      return true;
          });
}
//---------------------------
var CreateUser= async (req,res)=>{
    let rez= await IsEmail(req.body.email);
    console.log(rez);
     if(rez){
      console.log("в if");
      let a=await [req.body.email,req.body.password,req.body.tel,req.body.surname,req.body.name,req.body.t_name,req.body.date,req.body.gender];
      await pool.execute(conf.qBD.S_k,a,(err, results)=>{
      if(err){
            console.log(3);
            console.log(err);
            return res.render('reg',{data:"error"});
        }
        res.send('OK');
      })   
    }
    else{
      console.log(4);
      res.render('reg',{data:"Такой пользователь уже есть"});
    }
  }
//---------------------------

//---------------------------
router.get('/', function (req, res) {
    res.render("reg",{});
});

router.post('/', function (req, res) {
 CreateUser(req, res);

})

//---------------------------

module.exports = router;