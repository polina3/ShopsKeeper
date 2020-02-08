'use strict';
var express = require('express');
var router = express.Router();

var u={
	name:"TOM",
	password:"123"
}
router.get('/', function (req, res) {
    res.send(JSON.stringify(u));
});


module.exports = router;
