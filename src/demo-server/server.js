const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = Number(process.env.PORT || 4200);
const publicDir = path.join(__dirname, 'public');

const users = [
  { id: 'u-1', name: 'Alice Johnson', email: 'alice@demo.local', role: 'Admin' },
  { id: 'u-2', name: 'Bob Smith', email: 'bob@demo.local', role: 'Editor' },
  { id: 'u-3', name: 'Carla Gomez', email: 'carla@demo.local', role: 'Viewer' },
];

const products = [
  { id: 'p-1', name: 'Alpha Laptop', category: 'Electronics', price: 1299, stock: 25, status: 'Active' },
  { id: 'p-2', name: 'Nimbus Mouse', category: 'Accessories', price: 49, stock: 120, status: 'Active' },
  { id: 'p-3', name: 'Atlas Keyboard', category: 'Accessories', price: 89, stock: 80, status: 'Draft' },
];

app.use(express.json());
app.use(express.static(publicDir));

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (token !== 'demo-token') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'admin' && password === 'admin123') {
    return res.json({ token: 'demo-token', user: { name: 'QA Admin', role: 'Automation Lead' } });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/api/users', requireAuth, (_req, res) => {
  res.json(users);
});

app.post('/api/users', requireAuth, (req, res) => {
  const user = { id: uuidv4(), ...req.body };
  users.push(user);
  return res.status(201).json(user);
});

app.put('/api/users/:id', requireAuth, (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  users[index] = { ...users[index], ...req.body };
  return res.json(users[index]);
});

app.delete('/api/users/:id', requireAuth, (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  const [deleted] = users.splice(index, 1);
  return res.json({ deleted: deleted.id });
});

app.get('/api/products', requireAuth, (_req, res) => {
  res.json(products);
});

app.get('/api/slow-products', requireAuth, (req, res) => {
  const delayMs = Number(req.query.delay || 3000);
  setTimeout(() => {
    res.json(products);
  }, delayMs);
});

app.post('/api/products', requireAuth, (req, res) => {
  const payload = req.body || {};
  const product = {
    id: uuidv4(),
    ...payload,
    status: payload.status || 'Active',
  };
  products.push(product);
  return res.status(201).json(product);
});

app.put('/api/products/:id', requireAuth, (req, res) => {
  const index = products.findIndex((product) => product.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  return res.json(products[index]);
});

app.delete('/api/products/:id', requireAuth, (req, res) => {
  const index = products.findIndex((product) => product.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const [deleted] = products.splice(index, 1);
  return res.json({ deleted: deleted.id });
});

app.get('/api/search', requireAuth, (req, res) => {
  const term = String(req.query.q || '').toLowerCase();
  if (!term) {
    return res.json({ users, products });
  }

  const filteredUsers = users.filter((user) => JSON.stringify(user).toLowerCase().includes(term));
  const filteredProducts = products.filter((product) => JSON.stringify(product).toLowerCase().includes(term));
  return res.json({ users: filteredUsers, products: filteredProducts });
});

app.get('/api/error-demo', (_req, res) => {
  res.status(500).json({ message: 'Simulated server error' });
});

app.get('/api/empty-list', requireAuth, (_req, res) => {
  res.json([]);
});

app.get('*', (_req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  const raw = fs.readFileSync(indexPath, 'utf8');
  res.send(raw);
});

app.listen(PORT, () => {
  console.log(`Demo app listening on http://localhost:${PORT}`);
});
