const fs = require('fs');
const conf=JSON.parse(fs.readFileSync('config.json'));

module.exports=conf;