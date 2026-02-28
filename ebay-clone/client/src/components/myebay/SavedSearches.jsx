import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, TrashIcon, RefreshIcon, SearchIcon } from '@heroicons/react/outline';

const SavedSearches = () => {
  const [searches, setSearches] = useState([
    {
      id: 1,
      query: 'vintage camera',
      filters: {
        category: 'Electronics',
        minPrice: 100,
        maxPrice: 500,
        condition: ['Good', 'Like New']
      },
      frequency: 'daily',
      createdAt: '2 weeks ago',
      newItems: 5
    },
    {
      id: 2,
      query: 'leather jacket',
      filters: {
        category: 'Fashion',
        minPrice: 50,
        maxPrice: 200,
        size: ['M', 'L']
      },
      frequency: 'weekly',
      createdAt: '1 month ago',
      newItems: 2
    },
    {
      id: 3,
      query: 'smartwatch',
      filters: {
        category: 'Electronics',
        minPrice: 150,
        maxPrice: 400,
        brand: ['Apple', 'Samsung']
      },
      frequency: 'daily',
      createdAt: '3 days ago',
      newItems: 8
    }
  ]);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  });

  const handleDelete = (id) => {
    setSearches(searches.filter(search => search.id !== id));
  };

  const handleRefresh = (id) => {
    // Refresh search results
    console.log('Refreshing search:', id);
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Every day',
      weekly: 'Every week',
      monthly: 'Every month'
    };
    return labels[frequency] || frequency;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Saved Searches</h1>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-bold mb-4">Notification Settings</h2>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Email me when new items match my searches</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Push notifications</span>
          </label>
        </div>
      </div>

      {/* Saved Searches List */}
      <div className="space-y-4">
        {searches.map((search) => (
          <div key={search.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">"{search.query}"</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>{search.filters.category}</span>
                  <span>${search.filters.minPrice} - ${search.filters.maxPrice}</span>
                  {search.filters.condition && (
                    <span>{search.filters.condition.join(', ')}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {search.newItems > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {search.newItems} new
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <BellIcon className="h-4 w-4 mr-1" />
                  <span>{getFrequencyLabel(search.frequency)}</span>
                </div>
                <span className="text-sm text-gray-500">Saved {search.createdAt}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to={`/search?q=${encodeURIComponent(search.query)}`}
                  className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center"
                >
                  <SearchIcon className="h-4 w-4 mr-1" />
                  Search Now
                </Link>
                <button
                  onClick={() => handleRefresh(search.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <RefreshIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(search.id)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-gray-100"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick View of Recent Matches */}
            {search.newItems > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Recent matches:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].slice(0, Math.min(4, search.newItems)).map((i) => (
                    <div key={i} className="text-center">
                      <div className="bg-gray-200 h-16 rounded mb-1"></div>
                      <p className="text-xs text-gray-600">Item {i}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Search Button */}
      <div className="mt-8 text-center">
        <Link
          to="/search"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          <SearchIcon className="h-5 w-5 mr-2" />
          Start New Search
        </Link>
      </div>
    </div>
  );
};

export default SavedSearches;