import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-100 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10 text-sm">
          <div className="flex space-x-4">
            <Link to="/help" className="text-gray-600 hover:text-gray-900">
              Help
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link to="/community" className="text-gray-600 hover:text-gray-900">
              Community
            </Link>
          </div>
          <div className="flex space-x-4">
            {user ? (
              <>
                <Link to="/myebay" className="text-gray-600 hover:text-gray-900">
                  My eBay
                </Link>
                <Link to="/sell" className="text-gray-600 hover:text-gray-900">
                  Sell
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Sign in
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;