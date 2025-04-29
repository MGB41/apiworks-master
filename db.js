require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: true} : false
});

// Get a promise-based connection to use async/await
const promisePool = pool.promise();

// Create tables on startup
const initDb = async () => {
  try {
    console.log('Connecting to MySQL database');
    
    // Create products table if not exists
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        pid INT AUTO_INCREMENT PRIMARY KEY,
        pname VARCHAR(255) NOT NULL,
        description TEXT,
        quantity INT,
        price DECIMAL(10, 2)
      )
    `;

    // Create users table if not exists
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(191) NOT NULL UNIQUE,  
        password VARCHAR(255) NOT NULL
      )
    `;

    await promisePool.query(createProductsTable);
    console.log('Products table ready');
    
    await promisePool.query(createUsersTable);
    console.log('Users table ready');
    
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
};

// Initialize the database
initDb();

// For backward compatibility with existing code
// This allows existing query calls to work without changes
module.exports = {
  query: (sql, values, callback) => {
    return pool.query(sql, values, callback);
  },
  // Add the promise pool for new code that wants to use async/await
  promisePool
};

