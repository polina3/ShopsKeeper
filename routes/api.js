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
}).promise();
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
var r={
  response:""
};
//---------------------------
router.post("/email",(req,res)=>{
	console.log(req.body.email);
	 pool.execute(conf.qBD.q1,[req.body.email])
   .then((results)=>{
    if(results[0].length==0){
        console.log("-");
        r.response=false;
      }
      else{
        console.log("+");
        r.response=true;
      }
   })
   .then(()=>{
    res.send(JSON.stringify(r));
   })
   .catch(err=>{
    if(err){
          console.log(err);
          r.response="error";
          P_END(pool);
          res.send(JSON.stringify(r));
      }
   })
    
  

});
router.post("/password",(req,res)=>{
  let rez=[req.body.email,req.body.password];
	 pool.execute(conf.qBD.q2,rez)
   .then((results)=>{
    if(results.length==0){
        r.response=false;
      }
      else{
        r.response=true;
      }
   })
   .then(()=>{
     res.send(JSON.stringify(r));
   })
   .catch(err=>{
      console.log(err);
      r.response="error";
      res.send(JSON.stringify(r));
   })
      
});
router.post("/reg",(req,res)=>{
try{
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
      console.log(a);
}
catch(err){
  console.log(err);
  r.response="err";
  return res.send(JSON.stringify(r));
}

 
     
   pool.execute(conf.qBD.C_U,a)
   .then((results)=>{
    r.response=true;
    return res.send(JSON.stringify(r));
   })
   .catch((err)=>{
    console.log(err);
    r.response=error;
    return res.send(JSON.stringify(r));
   })
   
});


module.exports = router;
