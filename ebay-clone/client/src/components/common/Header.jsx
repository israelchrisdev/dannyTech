import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import SearchBar from './SearchBar';
import CategoryDropdown from './CategoryDropdown';
import { ShoppingCartIcon, UserIcon, BellIcon } from '@heroicons/react/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            eBay Clone
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/help" className="hover:text-gray-200">
              Help
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 hover:text-gray-200"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span className="hidden md:inline">{user.username}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                    <Link
                      to="/myebay"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My eBay
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/sell"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Sell
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-gray-200">
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-blue-500 py-2">
          <div className="flex items-center space-x-6">
            <CategoryDropdown />
            <Link to="/daily-deals" className="hover:text-gray-200 text-sm">
              Daily Deals
            </Link>
            <Link to="/brand-outlet" className="hover:text-gray-200 text-sm">
              Brand Outlet
            </Link>
            <Link to="/help" className="hover:text-gray-200 text-sm">
              Help & Contact
            </Link>
            <Link to="/sell" className="hover:text-gray-200 text-sm ml-auto">
              Sell
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;