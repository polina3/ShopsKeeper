//-------настройка все что связанно с expess--------------------
const express = require('express');
const session = require('express-session');
var SessionStore = require('express-mysql-session');
var router = express.Router();
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));
var app=express();

//-------подключение роутеров--------------------
var AV = require('./routes/AV.js');
var api = require('./routes/api.js');
var reg = require('./routes/reg.js');
var pp=require('./routes/PersonalPage.js');
var ad=require('./routes/AddShop.js');
var shop=require('./routes/shop.js');
var ap=require('./routes/AddProduct.js');
var home=require('./routes/index.js');
var Statistics=require('./routes/Statistics.js');
var product=require('./routes/product.js')
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
app.use('/', home);
app.use('/AV', AV);
app.use('/api', api);
app.use('/reg',reg);
app.use('/PersonalPage',isEmail,pp);
app.use('/AddShop',isEmail,ad);
app.use('/AddProduct',isEmail,ap);
app.use('/shop',shop);
app.use('/product',product);
app.use('/Statistics',Statistics);
console.log("server run   ");
console.log("");


app.listen(process.env.PORT || conf.port);