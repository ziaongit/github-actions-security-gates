const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint — used by ZAP DAST gate to confirm app is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple users endpoint
app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'member' },
  ]);
});

// GET /users/:id — parameterized query prevents SQL injection
// CodeQL scans data flow from req.params to DB queries
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  // Validate input — CodeQL checks this path
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // In production, this would use a parameterized pg query:
  // const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  res.json({ id: parseInt(id), name: 'Alice', role: 'admin' });
});

// POST /users — basic input validation
app.post('/users', (req, res) => {
  const { name, role } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required and must be a string' });
  }

  const allowedRoles = ['admin', 'member', 'viewer'];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  res.status(201).json({ id: 3, name, role: role || 'member' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
