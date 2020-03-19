const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

const devMode = process.env.devMode === 'production' || false;
const con = mysql.createConnection({
    host: 'localhost',
    port: devMode ? 3307 : 3306,
    user: devMode ? 'root' : 'leyrus',
    password: devMode ? '' : '55667788',
    database: 'avochat',
    Promise: bluebird,
});
global.mysqlCon

module.exports = con;
