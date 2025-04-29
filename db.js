const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'api_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');

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

  connection.query(createProductsTable, (err, result) => {
    if (err) throw err;
    console.log('Products table ready');
  });

  connection.query(createUsersTable, (err, result) => {
    if (err) throw err;
    console.log('Users table ready');
  });
});

module.exports = connection;
