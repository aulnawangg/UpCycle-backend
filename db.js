const { createPool } = require('mysql2');

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'db_upcycle',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
});

const db = pool.promise();

module.exports = db;
