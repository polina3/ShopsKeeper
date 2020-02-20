const express = require('express');
var router = express.Router();
var app=express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));

const pool = mysql.createPool({
    connectionLimit: 500,
    queueLimit:300,
    waitForConnections:true,

    host: conf.connectionBD.host,
    user: conf.connectionBD.user,
    database: conf.connectionBD.database,
    password: conf.connectionBD.password
}).promise();

pool.getConnection((err,connection)=>{
  if(err){
    connection.release();
    console.log(err);
  }
  console.log("SQL")
});

router.get('/email', function (req, res) {
    res.render("index_email",{});
});

router.post('/email', function (req, res) {
  pool.execute(conf.qBD.q1,req.body.email)
          .then(result =>{
            if(results.length==0){
              console.log("-e");
              res.render('index_email',{data:"Такого пользователя нет"});
            }
            else{
              console.log("+e");
              res.redirect("/password");
            }  
          })
          .catch(function(err) {
            console.log(err);
          });
});


/*router.get('/password', function (req, res) {
    res.render("index_password",{});
});

router.post('/password', function (req, res) {
    res.render("index_password",{});
});
*/

module.exports = router;