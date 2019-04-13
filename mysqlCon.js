var mysql = require('mysql');

module.exports.con = mysql.createPool({
    host: 'localhost',
    user: 'test',
    password: '?????',
    database: '?????',
    insecureAuth: true
});


