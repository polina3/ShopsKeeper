//-------настройка все что связанно с expess--------------------
const express = require('express');
var router = express.Router();
var app=express();
//-------SQL--------------------
const mysql = require("mysql2");
//-------config.json--------------------
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));

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
var g=0;

router.get('/:s', function (req, res) {
     
  	pool.execute(conf.qBD.Product,[req.params["s"]])
  .then(()=>{
    pool.execute("SELECT name FOR Shop  WHERE `id` = ?",[req.params["s"]])
    .then((result)=>{
      g=result;
    })
  })
  .then((result)=>{
  	console.log(result[0]);
    res.render("shop",{id:req.params["s"],product:result[0],name:g})
})
})

module.exports = router;