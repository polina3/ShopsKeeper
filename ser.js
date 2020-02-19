const express = require('express');
const mysql = require("mysql2");
var path = require('path');
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fs = require('fs');
var main = require('./routes/index');
var api = require('./routes/api');


var app=express();
const conf=JSON.parse(fs.readFileSync('config.json'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/static",express.static('static'));
app.set("view engine", "pug");
app.use('/', main);
app.use('/api', api);

 console.log("server run");



app.listen(process.env.PORT || conf.port);