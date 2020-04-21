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

router.get('/:i', function (req, res) {
  res.render("AddProduct",{});
});
router.post('/:i', function (req, res) {
	  a=[req.session.name,req.body.descrintion,i];
  pool.execute(conf.qBD.AddProduct,a)
        .then(() =>{
         res.render("AddProduct",{});
         res.redirect('shop/'+i);
       })
       .catch((err)=>{
            console.log(err);
            return res.send("error");
       })
  
});

module.exports = router;