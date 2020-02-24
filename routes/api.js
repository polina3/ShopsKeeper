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
const pool = mysql.createPool({
    connectionLimit: 500,
    queueLimit:300,
    waitForConnections:true,

    host: conf.connectionBD.host,
    user: conf.connectionBD.user,
    database: conf.connectionBD.database,
    password: conf.connectionBD.password
});

var r={
  response:""
};
router.post("/email",(req,res)=>{
	console.log(req.body.email);
	 pool.execute(conf.qBD.q1,req.body.email,
      function(err, results) {
        if(err){
          console.log(err);
          r.response="error";
      }
      if(results.length==0){
        console.log("-");
        r.response="false";
      }
      r.response="true";
 	});
   res.send(JSON.stringify(r));
   connection.end();
});
router.post("/password",(req,res)=>{
  let rez=[req.body.email,req.body.password];
	 pool.execute(conf.qBD.q2,rez,
      function(err, results) {
        if(err){
          console.log(err);
           r.response="error";
      }
      if(results.length==0){
        console.log("-");
         r.response="false";
      }
      r.response="true";
    });
   res.send(JSON.stringify(r));
   connection.end();
});



module.exports = router;
