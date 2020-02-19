'use strict';
var express = require('express');
var router = express.Router();
var app=express();
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

var r={
  response:""
};
router.post("/email",(req,res)=>{
	console.log(req.body.email);
	 connection.query(conf.qBD.q1,req.body.email,
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
router.post("/password",(req,res)=>{
  let rez=[req.body.email,req.body.password];
	 connection.query(conf.qBD.q2,rez,
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

connection.end();

module.exports = router;
