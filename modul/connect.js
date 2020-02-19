const mysql = require("mysql2");
const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('/config.json'));

var con=()=>{
	const connection = mysql.createConnection({
  		host: conf.connectionBD.host,
 		user: conf.connectionBD.user,
  		database: conf.connectionBD.database,
  		password: conf.connectionBD.password
  		});

  	connection.connect(function(err){
   		if (err) {
      		return console.error("Ошибка: " + err.message);
    	}
   		else{
      		console.log("Подключение к серверу MySQL успешно установлено");
    	}
 	});
 	return connection;
}
 module.exports=con;
 	
 


