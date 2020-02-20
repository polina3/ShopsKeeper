//---------------------------
const express = require('express');
var router = express.Router();
var app=express();
//---------------------------
const mysql = require("mysql2");
//---------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//---------------------------
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
});

pool.getConnection((connection,err)=>{
  if(err){
       console.log(err);
      connection.release();
  }
  else{
     console.log("OK_SQL");
      connection.release();
  }
     
    })


router.get('/', function (req, res) {
    res.render("index_email",{});
});

router.post('/', function (req, res) {
  pool.execute(conf.qBD.q1,req.body.email,(err, results)=>{
    if(err){
          console.log(err);
          return res.render('index_email',{data:"error"});
      }
     if(results.length==0){
        console.log("-e");
        return res.render('index_email',{data:"Такого пользователя нет"});
      }
      console.log(results[0].email);
      res.redirect('/password');
  })          
});


router.get('/password', function (req, res) {
    res.render("index_password",{});
});

/*router.post('/password', function (req, res) {
    res.render("index_password",{});
});
*/

module.exports = router;