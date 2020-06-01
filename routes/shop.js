//-------настройка все что связанно с expess--------------------
const express = require('express');
var router = express.Router();
var app=express();
//-------SQL--------------------
const mysql = require("mysql2");
//-------config.json--------------------
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));

var producct=require('./routes/product.js')
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
app.use('/product',product);

router.get('/:s', function (req, res) {
     
  	pool.execute(conf.qBD.Product,[req.params["s"]])
  .then((result)=>{
  	console.log(result[0]);
    res.render("shop",{name:req.params["s"],product:result[0]})
})
})

module.exports = router;