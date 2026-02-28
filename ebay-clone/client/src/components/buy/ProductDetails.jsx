import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice, timeRemaining } from '../../utils/formatters';
import { StarIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/outline';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { getProduct, placeBid, addToWatchlist } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data.product);
        if (response.data.product.bids?.length > 0) {
          setBidAmount(response.data.product.bids[0].amount + 1);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await placeBid(id, parseFloat(bidAmount));
      setProduct(prev => ({
        ...prev,
        bids: [response.data.bid, ...prev.bids]
      }));
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  const timeLeft = product.endTime ? timeRemaining(product.endTime) : null;
  const currentBid = product.bids?.[0]?.amount || product.startPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            <img
              src={product.images[selectedImage]?.url}
              alt={product.title}
              className="w-full h-96 object-contain border rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          
          {/* Seller Info */}
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600">Sold by:</span>
            <span className="ml-1 font-medium">{product.seller.username}</span>
            {product.seller.store && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Store
              </span>
            )}
          </div>

          {/* Condition */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">Condition:</span>
            <span className="ml-2 font-medium">{product.condition}</span>
          </div>

          {/* Price / Bid Section */}
          {product.type === 'FIXED_PRICE' && (
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
              </p>
            </div>
          )}

          {product.type === 'AUCTION' && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Current bid:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(currentBid)}
                </span>
              </div>
              {product.bids?.length > 0 && (
                <p className="text-sm text-gray-600 mb-2">
                  {product.bids.length} bid(s)
                </p>
              )}
              {timeLeft && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Time left:</p>
                  <p className="text-lg font-semibold text-red-600">{timeLeft}</p>
                </div>
              )}
              {product.reservePrice && currentBid < product.reservePrice && (
                <p className="text-sm text-orange-600">
                  Reserve not met
                </p>
              )}
            </div>
          )}

          {/* Bid Form (for auctions) */}
          {product.type === 'AUCTION' && user && user.id !== product.sellerId && (
            <form onSubmit={handleBidSubmit} className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={currentBid + 1}
                  step="0.01"
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter bid amount"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Place Bid
                </button>
              </div>
            </form>
          )}

          {/* Buy Actions */}
          {user && user.id !== product.sellerId && (
            <div className="space-y-4">
              {product.type !== 'AUCTION' && (
                <div className="flex space-x-4">
                  <div className="w-24">
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {[...Array(Math.min(10, product.quantity))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              <button
                onClick={() => addToWatchlist(product.id)}
                className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Add to Watchlist
              </button>

              <button className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition">
                Make Offer
              </button>
            </div>
          )}

          {/* Shipping Info */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-start space-x-3 mb-4">
              <TruckIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Free shipping</p>
                <p className="text-sm text-gray-600">Estimated delivery: 3-5 business days</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Money-back guarantee</p>
                <p className="text-sm text-gray-600">30-day returns, buyer pays return shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Item Description</h2>
        <div className="bg-white border rounded-lg p-6">
          <p className="whitespace-pre-line">{product.description}</p>
        </div>
      </div>

      {/* Seller Information */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Seller Information</h2>
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{product.seller.username}</p>
              <p className="text-sm text-gray-600">Member since {new Date(product.seller.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;