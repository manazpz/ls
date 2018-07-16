"use strict"
const mysql = require('mysql');
const db = mysql.createPool({
    host: '120.78.157.124',
    user: 'root',
    password: '123456',
    database: 'ls'
});
module.exports = db;