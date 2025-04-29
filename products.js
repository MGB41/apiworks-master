const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add new product
router.post('/', (req, res) => {
  const { pname, description, quantity, price } = req.body;
  const query = 'INSERT INTO products (pname, description, quantity, price) VALUES (?, ?, ?, ?)';
  db.query(query, [pname, description, quantity, price], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Product added', pid: result.insertId });
  });
});

// Delete product by id
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  db.query('DELETE FROM products WHERE pid = ?', [pid], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Product deleted' });
  });
});

// PUT: Update entire product by id
router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const { pname, description, quantity, price } = req.body;
  const query = 'UPDATE products SET pname = ?, description = ?, quantity = ?, price = ? WHERE pid = ?';
  db.query(query, [pname, description, quantity, price, pid], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Product fully updated' });
  });
});

// PATCH: Update part of the product
router.patch('/:pid', (req, res) => {
  const pid = req.params.pid;
  const fields = req.body;

  // Dynamically build query
  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = Object.values(fields);
  values.push(pid);

  const query = `UPDATE products SET ${updates} WHERE pid = ?`;
  db.query(query, values, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Product partially updated' });
  });
});

module.exports = router;
