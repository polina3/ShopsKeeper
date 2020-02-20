//-------настройка все что связанно с expess--------------------
const express = require('express');
const session = require('express-session');
var SessionStore = require('express-mysql-session');
var router = express.Router();
var app=express();
//-------подключение роутеров--------------------
var main = require('./routes/index');
var api = require('./routes/api');
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));
//---------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//---------------------------
var options = {
 	host: conf.connectionBD.host,
    user: conf.connectionBD.user,
    database: conf.connectionBD.database,
    password: conf.connectionBD.password
}

//-------настройка session--------------------
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new SessionStore(options)
}))



app.use("/static",express.static('static'));

app.set("view engine", "pug");
app.use('/', main);
//app.use('/api', api);

console.log("server run");



app.listen(process.env.PORT || conf.port);