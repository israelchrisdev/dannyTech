import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { HeartIcon as HeartSolid } from '@heroicons/react/solid';
import { TrashIcon } from '@heroicons/react/outline';

const WatchList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getWatchlist, toggleWatchlist } = useProducts();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await getWatchlist();
      setItems(response.data.watchlist);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await toggleWatchlist(productId);
      setItems(items.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <HeartSolid className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
        <p className="text-gray-600 mb-4">
          Start adding items you're interested in to keep track of them.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Browse Items
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">My Watchlist</h2>
        <p className="text-sm text-gray-600 mt-1">
          {items.length} items being watched
        </p>
      </div>

      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex items-center space-x-4">
            {/* Image */}
            <Link to={`/product/${item.id}`} className="flex-shrink-0">
              {item.images?.[0] ? (
                <img
                  src={item.images[0].url}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
              )}
            </Link>

            {/* Details */}
            <div className="flex-1">
              <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                <h3 className="font-medium">{item.title}</h3>
              </Link>
              <p className="text-sm text-gray-600 mt-1">Condition: {item.condition}</p>
              <p className="text-sm text-gray-600">Seller: {item.seller?.username}</p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold">${item.price}</p>
              {item.type === 'AUCTION' && (
                <p className="text-xs text-gray-500">
                  {item.bids?.length || 0} bids
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Link
                to={`/product/${item.id}`}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                View Item
              </Link>
              <button
                onClick={() => handleRemove(item.id)}
                className="p-2 text-red-500 hover:text-red-700 border rounded-lg"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;