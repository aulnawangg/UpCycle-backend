const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host : '34.101.193.17',
    user: 'upcycle',
    password: 'ch2-ps221', // replace with your root password
    database: 'db_upcycle', // replace with your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
