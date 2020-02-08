'use strict';
var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require('express-session');
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));

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
    res.render("index",{});
});

module.exports = router;
