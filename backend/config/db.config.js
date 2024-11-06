const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables here

// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASS:', process.env.DB_PASS);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_NAME:', process.env.DB_NAME);

const dbConfig = {
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
}
// Create the connection pool  
const pool = mysql.createPool(dbConfig);
// Prepare a function that will execute the SQL queries asynchronously
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}
module.exports = { query };