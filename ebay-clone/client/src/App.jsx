import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import api from './services/api';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import './styles/global.css';

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <Link to="/" className="brand">eBay Clone</Link>
      <nav>
        <Link to="/">Shop</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user ? (
          <button onClick={logout} className="link-button">Logout {user.name}</button>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </nav>
    </header>
  );
};

const ProductCard = ({ product, onAdd }) => (
  <article className="card">
    <img src={product.imageUrl} alt={product.title} />
    <h3>{product.title}</h3>
    <p className="muted">{product.category} · {product.condition}</p>
    <p className="price">${product.price.toFixed(2)}</p>
    <button onClick={() => onAdd(product)}>Add to cart</button>
  </article>
);

const HomePage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const loadProducts = useCallback(async () => {
    const response = await api.get('/products', { params: { q: query, category } });
    setProducts(response.data.products);
  }, [query, category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <section>
      <h1>Find your next deal</h1>
      <div className="filters">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Sports">Sports</option>
          <option value="Collectibles">Collectibles</option>
        </select>
        <button onClick={loadProducts}>Search</button>
      </div>
      <div className="grid">
        {products.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
      </div>
    </section>
  );
};

const CartPage = () => {
  const { cartItems, subtotal, removeFromCart, clearCart } = useCart();
  return (
    <section>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? <p>No items in cart yet.</p> : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-row">
              <span>{item.title} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
          <button onClick={clearCart}>Clear cart</button>
        </>
      )}
    </section>
  );
};

const SellPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ title: '', price: '', category: 'Electronics', description: '', imageUrl: '' });

  if (!isAuthenticated) return <Navigate to="/auth" />;

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/listings', form);
    navigate('/');
  };

  return (
    <section>
      <h1>Create listing</h1>
      <form className="form" onSubmit={submit}>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input required type="number" min="1" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option>Electronics</option><option>Fashion</option><option>Home</option><option>Sports</option><option>Collectibles</option>
        </select>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <button type="submit">Publish listing</button>
      </form>
    </section>
  );
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const title = useMemo(() => (mode === 'login' ? 'Login' : 'Create account'), [mode]);

  const submit = async (e) => {
    e.preventDefault();
    if (mode === 'login') await login({ email: form.email, password: form.password });
    if (mode === 'register') await register(form);
    navigate('/');
  };

  return (
    <section>
      <h1>{title}</h1>
      <form className="form" onSubmit={submit}>
        {mode === 'register' && <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">{title}</button>
      </form>
      <button className="link-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </section>
  );
};

function App() {
  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
