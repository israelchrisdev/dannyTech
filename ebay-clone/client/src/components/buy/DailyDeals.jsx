import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

const DailyDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getProducts } = useProducts();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await getProducts({ 
          sort: 'discount_desc',
          limit: 4 
        });
        setDeals(response.data.products);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {deals.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`} className="block">
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <div className="relative pb-[100%]">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200"></div>
              )}
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                -20%
              </span>
            </div>
            <div className="p-2">
              <p className="text-sm font-medium line-clamp-2">{product.title}</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="text-xs text-gray-400 line-through">
                  ${(product.price * 1.25).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DailyDeals;