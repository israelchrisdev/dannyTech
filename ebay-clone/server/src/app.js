const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Collectibles'];

const products = [
  {
    id: 'p-1',
    title: 'Apple iPhone 14 Pro 128GB',
    price: 699.99,
    category: 'Electronics',
    condition: 'Used - Excellent',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    description: 'Unlocked iPhone 14 Pro, 128GB, battery health 92%.'
  },
  {
    id: 'p-2',
    title: 'Nike Air Max 270',
    price: 89.99,
    category: 'Fashion',
    condition: 'New',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    description: 'Comfortable running shoes in original box.'
  },
  {
    id: 'p-3',
    title: 'Vintage Camera Canon AE-1',
    price: 249.5,
    category: 'Collectibles',
    condition: 'Used - Good',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    description: 'Classic 35mm SLR, fully functional with minor wear.'
  },
  {
    id: 'p-4',
    title: 'Gaming Chair Ergonomic',
    price: 139.0,
    category: 'Home',
    condition: 'New',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800',
    description: 'Adjustable lumbar support and recline for long sessions.'
  }
];

const users = [];

const createToken = () => crypto.randomBytes(18).toString('hex');

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/categories', (_req, res) => {
  res.json({ categories });
});

app.get('/api/products', (req, res) => {
  const { q = '', category = '', minPrice, maxPrice, sort = 'latest' } = req.query;

  let filtered = [...products];

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

  res.json({ products: filtered, total: filtered.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const newUser = { id: `u-${users.length + 1}`, name, email, password };
  users.push(newUser);

  return res.status(201).json({
    token: createToken(),
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((entry) => entry.email === email && entry.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    token: createToken(),
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.post('/api/listings', (req, res) => {
  const { title, price, category, description, imageUrl, condition = 'Used - Good' } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ message: 'title, price and category are required' });
  }

  const listing = {
    id: `p-${products.length + 1}`,
    title,
    price: Number(price),
    category,
    description: description || '',
    condition,
    imageUrl:
      imageUrl ||
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800'
  };

  products.unshift(listing);

  return res.status(201).json({ product: listing });
});

module.exports = app;
