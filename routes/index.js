'use strict';
var express = require('express');
var router = express.Router();
var app=express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require('express-session');
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
var pass="";

const connection = mysql.createConnection({
  host: conf.connectionBD.host,
  user: conf.connectionBD.user,
  database: conf.connectionBD.database,
  password: conf.connectionBD.password
  });

app.use(session({
    secret: 'secretWord',   // секретное слово для шифрования
    key: 'key',             // имя куки
    cookie: {
        path: '/',          // где действует
        httpOnly: true,     // чтобы куку не могли читать на клиенте
        maxAge: null        // время жизни куки
    },
    saveUninitialized: false,   // on default
    resave: false               // on  default
}));


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
          return res.render('index_email',{data:"error"});
      }
      if(results.length==0){
        console.log("-");
        return res.render('index_email',{data:"Такого пользователя нет"});
      }
      console.log(results[0].email);
      req.session.email=results[0].email;
      res.render("index_password",{});
      
    });
  }
  else if(req.body.password){
    if(req.session.email='' || !req.session.email){
      res.render("index_email",{});
    }
      let rez=[req.session.email,req.body.password];
     connection.query(conf.qBD.q2,rez,
        function(err, results) {
          if(err){
            console.log(err);
            return res.render('index_password',{data:"error"});
        }
        if(results.length==0){
          console.log("-");
          return res.render('index_password',{data:"неверный пароль"});
        }
        res.send("Ok");
      });
     connection.end();
    }
  });

router.get('/reg', function (req, res) {
    res.render("reg",{});
});
module.exports = router;
