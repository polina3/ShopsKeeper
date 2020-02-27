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
var P_END=(pool)=>{
  pool.end((err)=>{
    if (err) {
      console.log(err.message);
    }
    console.log("пул закрыт");
  });
}
var r={
  response:""
};
router.post("/email",async (req,res)=>{
	console.log(req.body.email);
	await pool.execute(conf.qBD.q1,[req.body.email],
      function(err, results) {
        if(err){
          console.log(err);
          r.response="error";
          P_END(pool);
      }
      if(results.length==0){
        console.log("-");
        r.response=false;
      }
      else{
        console.log("+");
        r.response=true;
      }
 	});
   res.send(JSON.stringify(r));

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
});
router.post("/reg",(req,res)=>{
 let a=[
        req.body.email,
        req.body.password,
        req.body.tel,
        req.body.surname,
        req.body.name,
        req.body.t_name,
        req.body.date,
        req.body.gender
      ];
   pool.execute(conf.qBD.C_U,a)
   .then(()=>{
    r.response="true";
   })
   .catch((err)=>{
    r.response=error;
   })
    res.send(JSON.stringify(r));
});


module.exports = router;
