'use strict';
var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require('express-session');
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));

var app=express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
var rez=[];

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

router.get('/', function (req, res) {
    res.render("index_email",{});
});
router.post('/', function (req, res) {
  if(req.body.email){
    connection.query(conf.qBD.q1,req.body.email,
      function(err, results) {
        if(err){
          console.log(err);
          return res.render('index',{data:"error"});
      }
      if(results.length==0){
        console.log("-");
        return res.render('index',{data:"Такого пользователя нет"});
         
      }
      res.render("index_password",{});
      console.log("+");
    });
  }
  else if(req.body.password){
    connection.query(conf.qBD.q2,req.body.password,
      function(err, results) {
        if(err){
          console.log(err);
          return res.render('index',{data:"error"});
      }
      if(results.length==0){
        console.log("-");
        return res.render('index',{data:"Неправильнеый логин"});
      }
      res.send("ok");
      console.log("+");
    });
  }
  else{
    res.send("error");
  }
  	
});

module.exports = router;
