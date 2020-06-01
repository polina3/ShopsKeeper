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
  	pool.execute(conf.qBD.ProductGet,[req.params["s"]])
  .then((result)=>{
  	console.log(result);
    res.render("product",{name:req.params["s"],product:result[0]})
})
})

module.exports = router;