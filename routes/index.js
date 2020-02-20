//-------настройка все что связанно с expess--------------------
const express = require('express');
const session = require('express-session');
var SessionStore = require('express-mysql-session');
var router = express.Router();
var app=express();
//-------SQL--------------------
const mysql = require("mysql2");
//-------bodyParser--------------------
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//-------config.json--------------------
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('./config.json'));
//-------настройка session--------------------
var options = {
    host: conf.connectionBD.host,
    user: conf.connectionBD.user,
    database: conf.connectionBD.database,
    password: conf.connectionBD.password
}

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new SessionStore(options),
    saveUninitialized: true,
    resave:false
}))

//---------------------------
var P_END=(pool)=>{
  pool.end((err)=>{
    if (err) {
      console.log(err.message);
    }
    console.log("пул закрыт");
  });
}
//---------------------------
var isEmail=(reg,res, next)=>{
  if(req.session.email='' || req.session.email){
    res.redirect('/');
  }
  else{
    return next();
  }
}
//---------------------------
const pool = mysql.createPool({
    connectionLimit: 500,
    queueLimit:300,
    waitForConnections:true,

    host: conf.connectionBD.host,
    user: conf.connectionBD.user,
    database: conf.connectionBD.database,
    password: conf.connectionBD.password
});
//---------------------------
router.get('/', function (req, res) {
    res.render("index_email",{});
});

router.post('/', function (req, res) {
  pool.execute(conf.qBD.q1,[req.body.email],(err, results)=>{
    if(err){
          console.log(err);
          return res.render('index_email',{data:"error"});
      }
     if(results.length==0){
        console.log("-e");
        return res.render('index_email',{data:"Такого пользователя нет"});
      }
      console.log(results[0].email);
      req.session.email=results[0].email;
      res.redirect('/password');
  })   
  P_END(pool);       
});


router.get('/password', function (req, res) {
    res.render("index_password",{});
});

router.post('/password',isEmail, function (req, res) {
  console.log(req.session.email);
  let data=[req.session.email,req.body.password];
   pool.execute(conf.qBD.q2,data,(err, results)=>{
    if(err){
          console.log(err);
         return res.render('index_password',{data:"error"});
      }
    if(results.length==0){
        console.log("-p");
        return res.render('index_password',{data:"неверный пароль"});
      }
    res.send("Ok");
  })   
  P_END(pool);           
});
//---------------------------

module.exports = router;