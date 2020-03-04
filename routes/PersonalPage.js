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
  if((req.session.email=='') || (typeof req.session.email == undefined)){
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
}).promise();
//---------------------------

router.get('/', function (req, res) {
  pool.execute(conf.qBD.Shop,req.session.email)
  .then((result)=>{
    console.log(result);
     res.render("PersonalPage",{login:req.session.email,shops:[4,5]});
  })
});

module.exports = router;