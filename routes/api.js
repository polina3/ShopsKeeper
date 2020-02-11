'use strict';
var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require('fs');

const conf=JSON.parse(fs.readFileSync('config.json'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: conf.connectionBD.host,
  user: conf.connectionBD.user,
  database: conf.connectionBD.database,
  password: conf.connectionBD.password
  });

connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });
var rez_req="";


router.post("/email",(req,res)=>{
	rez_req=JSON.parse(req.body);
	 connection.query(conf.qBD.q1,rez_req.email,
      function(err, results) {
        if(err){
          console.log(err);
          return res.send("error");
      }
      if(results.length==0){
        console.log("-");
        return res.send("Такого пользователя нет");
         
      }
      res.send(true);
    });
});
router.post("/password",(req,res)=>{
	rez_req=JSON.parse(req.body);
	 connection.query(conf.qBD.q1,rez_req.password,
      function(err, results) {
        if(err){
          console.log(err);
          return res.send("error");
      }
      if(results.length==0){
        console.log("-");
        return res.send("Неправильнеый пароль");
         
      }
      res.send(true);
    });
});


module.exports = router;
