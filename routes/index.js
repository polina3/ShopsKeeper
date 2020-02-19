'use strict';
var express = require('express');
var router = express.Router();
var app=express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require('express-session');
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));
var connection = require('./modul/connect');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

/*const connection = mysql.createConnection({
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
 });*/

router.get('/', function (req, res) {
    res.render("index_email",{});
});

router.post('/', function (req, res) {
  if(req.body.email){
    connection.query(conf.qBD.q1,req.body.email,
      function(err, results) {
        if(err){
          console.log(err);
          return res.render('index_email',{data:"error"});
      }
      if(results.length==0){
        console.log("-");
        return res.render('index_email',{data:"Такого пользователя нет"});
      }
      res.render("index_password",{});
      console.log("log");
    });
  }
  else if(req.body.password){
      if(req.body.password==pass){
        return res.send("ok");
        console.log("pas")
      }
      else{
        return ress.render('index_password',{data:"Неправильнеый пароль "});
      }
  }
  else{
    res.send("error");
  }
     connection.query(conf.qBD.q2,req.body.password,
     	function(err, results) {
        	if(err){
          		console.log(err);
          		return res.send("error");
      		}
      		if(results.length==0){
        		console.log("-");
       			 return res.render('index_password',{data:"Неправильнеый пароль "});
          }
          else{
            res.send("ok");
          }
 });

router.get('/reg', function (req, res) {
    res.render("reg",{});
});
connection.end();



module.exports = router;
