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
}).promise();
//---------------------------


//---------------------------
router.get('/', function (req, res) {
    res.render("reg",{});
});

router.post('/', function (req, res) {
 pool.execute(conf.qBD.q1,[req.body.email])
  .then(results =>{
    if(results[0].length!=0){
      console.log(results);
      res.render('reg',{data:"Такой пользователь уже есть"});
    }
    else{
        console.log("else");
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
        pool.execute(conf.qBD.C_U,a)
        .then(() =>{
         res.redirect('45.67.57.219:3000/');
       })
       .catch((err)=>{
            console.log(err);
            return res.render('reg',{data:"error"});
       })
    }
          })
  .catch((err)=>{
            console.log(err.message);
          });

})

//---------------------------

module.exports = router;