import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Components
import SellDashboard from './components/sell/SellDashboard';
import CreateListing from './components/sell/CreateListing';
import Dashboard from './components/myebay/Dashboard';
import HelpCenter from './components/help/HelpCenter';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const SellerRoute = ({ children }) => {
  const { isAuthenticated, isSeller } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isSeller) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/help/*" element={<HelpCenter />} />

      {/* Private Routes */}
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/myebay/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Seller Routes */}
      <Route
        path="/sell/*"
        element={
          <SellerRoute>
            <SellDashboard />
          </SellerRoute>
        }
      />
      
      <Route
        path="/sell/create"
        element={
          <SellerRoute>
            <CreateListing />
          </SellerRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;