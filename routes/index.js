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

app.use(session({
    key: 'application.sid',
    secret: 'some.secret.string',
    cookie: {
        maxAge: 60 * 60 * 1000,
        expires: 60 * 60 * 1000
    },
    saveUninitialized: true,
    rolling: true,
    resave: true,
    secure: true
}));

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
    res.render("index",{});
});
router.post('/', function (req, res) {
    rez=[req.body.login,req.body.password];
  	connection.query(conf.qBD.q,rez,
    function(err, results) {
      if(err){
        console.log(err);
        return res.render('index',{data:"error"});
      }
      console.log(results); 
      if(results.length==0){
      	console.log("-");
        return res.render('index',{data:"Непрвильный логин или пароль"});
      }
      req.session.login=results[0].login+results[0].buy;
      console.log("+");
    });
});

module.exports = router;
