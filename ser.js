//-------настройка все что связанно с expess--------------------
const express = require('express');
const session = require('express-session');
var SessionStore = require('express-mysql-session');
var router = express.Router();
var conf=require('config_local');
var app=express();
//-------подключение роутеров--------------------
var main = require('./routes/index');
var api = require('./routes/api');
var reg = require('./routes/reg');
var pp=require('./routes/PersonalPage.js')
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
//---------------------------
var isEmail=(req,res, next)=>{
 if(typeof req.session.email === 'undefined' || req.session.email === null){
    res.redirect('/');
  }
  else{
    return next();
  }
}
//-------настройка session--------------------
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new SessionStore(options),
    saveUninitialized: false,
    resave:false
}))
//---------------------------
app.use("/static",express.static('static'));
app.set("view engine", "pug");
//---------------------------
app.use('/', main);
app.use('/api', api);
app.use('/reg',reg);
app.use('/PersonalPage',isEmail,pp);


console.log("server run");


app.listen(process.env.PORT || conf.port);