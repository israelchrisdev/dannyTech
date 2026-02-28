import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TagIcon, TrendingUpIcon, CalendarIcon, CheckIcon } from '@heroicons/react/outline';

const PromotionsManager = () => {
  const [activeTab, setActiveTab] = useState('available');

  const availablePromotions = [
    {
      id: 1,
      name: 'Featured Listing',
      description: 'Get your item featured at the top of search results',
      duration: '7 days',
      price: 4.99,
      benefits: ['Top of search results', 'Featured badge', 'Increased visibility']
    },
    {
      id: 2,
      name: 'Markdown Sale',
      description: 'Create a sale event with discounted prices',
      duration: '14 days',
      price: 9.99,
      benefits: ['Sale badge', 'Special pricing', 'Promoted in sale section']
    },
    {
      id: 3,
      name: 'Social Media Boost',
      description: 'Promote your items on social media platforms',
      duration: '30 days',
      price: 14.99,
      benefits: ['Social media posts', 'Targeted audience', 'Analytics dashboard']
    }
  ];

  const activePromotions = [
    {
      id: 4,
      name: 'Bold Listing',
      product: 'Vintage Camera',
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      status: 'active',
      views: 234,
      clicks: 45
    },
    {
      id: 5,
      name: 'Markdown Sale',
      product: 'Designer Watch',
      startDate: '2024-01-10',
      endDate: '2024-01-24',
      status: 'active',
      views: 567,
      clicks: 89
    }
  ];

  const promotionHistory = [
    {
      id: 6,
      name: 'Featured Listing',
      product: 'Antique Chair',
      date: '2023-12-01',
      status: 'completed',
      views: 1234,
      sales: 1
    },
    {
      id: 7,
      name: 'Social Media Boost',
      product: 'Leather Jacket',
      date: '2023-11-15',
      status: 'completed',
      views: 3456,
      sales: 3
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Promotions Manager</h1>
      <p className="text-gray-600 mb-6">Boost your sales with targeted promotions</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Promotions</p>
              <p className="text-2xl font-bold mt-1">2</p>
            </div>
            <TagIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold mt-1">1,234</p>
            </div>
            <TrendingUpIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold mt-1">12.5%</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-4 px-1 ${
              activeTab === 'available'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Available Promotions
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-4 px-1 ${
              activeTab === 'active'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Promotions
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-1 ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Available Promotions */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePromotions.map((promo) => (
            <div key={promo.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-2">{promo.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Benefits:</p>
                <ul className="space-y-1">
                  {promo.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium">{promo.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-lg font-bold text-blue-600">${promo.price}</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Apply to Listing
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Promotions */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activePromotions.map((promo) => (
            <div key={promo.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold">{promo.name}</h3>
                  <p className="text-sm text-gray-600">Product: {promo.product}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(promo.status)}`}>
                  {promo.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium">{promo.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-sm font-medium">{promo.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Left</p>
                  <p className="text-sm font-medium">5 days</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-lg font-bold">{promo.views}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Clicks</p>
                  <p className="text-lg font-bold">{promo.clicks}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button className="text-sm border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">
                  View Details
                </button>
                <button className="text-sm bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {promotionHistory.map((promo) => (
            <div key={promo.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold">{promo.name}</h3>
                  <p className="text-sm text-gray-600">Product: {promo.product}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(promo.status)}`}>
                  {promo.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium">{promo.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-sm font-medium">{promo.views}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sales</p>
                  <p className="text-sm font-medium">{promo.sales}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="text-sm text-blue-600 hover:underline">
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionsManager;