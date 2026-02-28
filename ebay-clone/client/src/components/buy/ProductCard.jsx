import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { formatPrice, timeAgo } from '../../utils/formatters';

const ProductCard = ({ product, onToggleWatchlist, isInWatchlist }) => {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative pb-[100%] overflow-hidden rounded-t-lg">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Condition Badge */}
          <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {product.condition}
          </span>

          {/* Watchlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWatchlist(product.id);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            {isInWatchlist ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600">
            {product.title}
          </h3>
          
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.type === 'AUCTION' && (
              <span className="text-xs text-gray-500">
                {product.bids?.length || 0} bids
              </span>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex items-center text-xs text-gray-500">
            <span>by {product.seller?.username}</span>
            {product.seller?.store && (
              <span className="ml-1 text-blue-600">★ Store</span>
            )}
          </div>

          {/* Time Info */}
          <div className="mt-2 text-xs text-gray-400">
            {product.type === 'AUCTION' && product.endTime ? (
              <span>Ends {timeAgo(product.endTime)}</span>
            ) : (
              <span>Listed {timeAgo(product.createdAt)}</span>
            )}
          </div>
        </Link>

        {/* Quick Actions */}
        <div className="mt-3 flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 transition">
            Buy Now
          </button>
          {product.type === 'BEST_OFFER' && (
            <button className="flex-1 border border-gray-300 text-gray-700 text-sm py-1.5 rounded hover:bg-gray-50 transition">
              Make Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;