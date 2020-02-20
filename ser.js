const express = require('express');
var app=express();
var main = require('./routes/index');
//var api = require('./routes/api');
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));
//---------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//---------------------------




app.use("/static",express.static('static'));

app.set("view engine", "pug");
app.use('/', main);
//app.use('/api', api);

console.log("server run");



app.listen(process.env.PORT || conf.port);