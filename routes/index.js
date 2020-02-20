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
});

pool.getConnection((err,connection)=>{
  if(err){
    connection.release();
    console.log(err);
  }
  console.log("SQL")
});

module.exports = router;