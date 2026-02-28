import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { TrashIcon, ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/outline';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getCartCount 
  } = useCart();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBagIcon className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({getCartCount()} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0].url}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                        <h3 className="font-medium">{item.title}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">Condition: {item.condition}</p>
                      <p className="text-sm text-gray-600">Seller: {item.seller?.username}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Qty:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
                <span className="font-medium">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="font-medium">${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl">
                  ${(getCartTotal() * 1.08).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mb-3"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-blue-600 hover:underline text-sm"
            >
              Continue Shopping
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">We accept:</p>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">Visa</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">Mastercard</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">PayPal</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">Apple Pay</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;