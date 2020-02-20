const express = require('express');
const mysql = require("mysql2");
var path = require('path');
const session = require('express-session');
const bodyParser = require("body-parser");
//var main = require('./routes/index');
//var api = require('./routes/api');
const conf=require('./config');

var app=express();

/*app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/static",express.static('static'));
app.set("view engine", "pug");
app.use('/', main);
app.use('/api', api);

 console.log("server run");*/



app.listen(process.env.PORT || conf.port);