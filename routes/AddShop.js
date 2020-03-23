//-------настройка все что связанно с expess--------------------
const express = require('express');
var router = express.Router();
var app=express();
//-------загрузка файлов--------------------
const multer  = require("multer");
const upload = multer({dest:"uploads"});
//-------SQL--------------------
const mysql = require("mysql2");
//-------config.json--------------------
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
}).promise();
//---------------------------

router.get('/', function (req, res) {
  res.render("AddShop",{});
});
router.post('/', upload.single("filedata"), function (req, ,res) {
  a=[req.session.email,
  req.body.type,
  req.body.descrintion,
  req.body.instagram,
  req.body.facebook,
  req.body.WEBSITE,
  req.body.name];
  let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
   console.log(a);
});

module.exports = router;