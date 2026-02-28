import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, ChevronDownIcon, StarIcon } from '@heroicons/react/outline';

const PurchaseHistory = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const purchases = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      items: [
        {
          id: 101,
          title: 'Vintage Camera',
          image: 'https://via.placeholder.com/100',
          price: 299.99,
          quantity: 1,
          seller: 'vintageshop'
        }
      ],
      total: 299.99,
      status: 'delivered',
      tracking: 'TRK123456789'
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      date: '2024-01-10',
      items: [
        {
          id: 102,
          title: 'Designer Watch',
          image: 'https://via.placeholder.com/100',
          price: 599.99,
          quantity: 1,
          seller: 'luxurytime'
        }
      ],
      total: 599.99,
      status: 'shipped',
      tracking: 'TRK987654321'
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      date: '2024-01-05',
      items: [
        {
          id: 103,
          title: 'Leather Jacket',
          image: 'https://via.placeholder.com/100',
          price: 199.99,
          quantity: 1,
          seller: 'fashionhub'
        },
        {
          id: 104,
          title: 'Stylish Boots',
          image: 'https://via.placeholder.com/100',
          price: 149.99,
          quantity: 1,
          seller: 'fashionhub'
        }
      ],
      total: 349.98,
      status: 'processing',
      tracking: null
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (filter !== 'all' && purchase.status !== filter) return false;
    if (searchTerm) {
      return purchase.items.some(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) || purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Purchase History</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {filteredPurchases.map((purchase) => (
          <div key={purchase.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{purchase.orderNumber}</p>
                  <p className="text-sm text-gray-600">Placed on {new Date(purchase.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(purchase.status)}`}>
                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                  </span>
                  {purchase.tracking && (
                    <button className="text-sm text-blue-600 hover:underline">
                      Track Package
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="divide-y">
              {purchase.items.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start space-x-4">
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                            <h3 className="font-medium">{item.title}</h3>
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">Seller: {item.seller}</p>
                        </div>
                        <p className="font-bold">${item.price}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        
                        {purchase.status === 'delivered' && (
                          <div className="flex space-x-3">
                            <button className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center">
                              <StarIcon className="h-4 w-4 mr-1" />
                              Leave Review
                            </button>
                            <button className="text-sm border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">
                              Buy Again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="bg-gray-50 p-4 border-t">
              <div className="flex items-center justify-between">
                <button className="text-sm text-blue-600 hover:underline">
                  View Order Details
                </button>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-bold">${purchase.total}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;