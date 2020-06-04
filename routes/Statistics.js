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


router.get('/:s', function (req, res) {
     
  	pool.execute(conf.qBD.Statistic_V,[req.params["s"]])
  .then((result)=>{
    var r1=result[0]
    pool.execute(conf.qBD.Statistic_D,[req.params["s"]])
    .then((result)=>{
      res.render("Statistic",{D:result[0],V:r1})
    })
  })
})

module.exports = router;