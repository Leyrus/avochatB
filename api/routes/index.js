const mysql = require('mysql');

const devMode = false;
const con = mysql.createConnection({
    host: 'localhost',
    port: devMode ? 3307 : 3306,
    user: devMode ? 'root' : 'leyrus',
    password: devMode ? '' : '55667788',
    database: 'avochat',
});

con.connect(function (err) {
    if (err) {
        throw err;
    }
    console.debug('Connected DB!');
});

module.exports = con;
