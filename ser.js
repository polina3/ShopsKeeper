const express = require('express');
var main = require('./routes/index');
//var api = require('./routes/api');
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));


var app=express();



app.use("/static",express.static('static'));

app.set("view engine", "pug");
app.use('/', main);
app.use('/api', api);

console.log("server run");



app.listen(process.env.PORT || conf.port);