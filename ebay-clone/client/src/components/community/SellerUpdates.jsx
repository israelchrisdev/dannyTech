import React, { useState } from 'react';
import { BellIcon, ClockIcon, NewspaperIcon, TagIcon } from '@heroicons/react/outline';

const SellerUpdates = () => {
  const [filter, setFilter] = useState('all');

  const updates = [
    {
      id: 1,
      type: 'policy',
      title: 'New Seller Protection Policy',
      content: 'We\'ve updated our seller protection policy to provide better coverage for your listings.',
      date: '2 hours ago',
      read: false,
      category: 'Policy Update'
    },
    {
      id: 2,
      type: 'feature',
      title: 'New Bulk Listing Tool Available',
      content: 'Save time with our new bulk listing tool. List up to 100 items at once!',
      date: '1 day ago',
      read: true,
      category: 'New Feature'
    },
    {
      id: 3,
      type: 'promotion',
      title: 'Summer Seller Promotion',
      content: 'Get reduced fees on all listings placed during June. Terms apply.',
      date: '3 days ago',
      read: false,
      category: 'Promotion'
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Shipping Rate Changes',
      content: 'Important updates to shipping rates from major carriers starting next month.',
      date: '1 week ago',
      read: true,
      category: 'Announcement'
    },
    {
      id: 5,
      type: 'tip',
      title: 'Tips for Better Product Photos',
      content: 'Learn how professional photos can increase your sales by up to 30%.',
      date: '2 weeks ago',
      read: true,
      category: 'Selling Tips'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Updates', icon: NewspaperIcon, count: 12 },
    { id: 'policy', name: 'Policy Updates', icon: BellIcon, count: 3 },
    { id: 'feature', name: 'New Features', icon: TagIcon, count: 5 },
    { id: 'promotion', name: 'Promotions', icon: TagIcon, count: 2 },
    { id: 'announcement', name: 'Announcements', icon: NewspaperIcon, count: 2 }
  ];

  const filteredUpdates = filter === 'all' 
    ? updates 
    : updates.filter(update => update.type === filter);

  const unreadCount = updates.filter(u => !u.read).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Seller Updates</h1>
        <p className="text-gray-600 mt-1">
          Stay informed about the latest news, features, and policy changes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Categories</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                    filter === category.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <category.icon className="h-5 w-5" />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm">
                Mark All as Read
              </button>
            </div>
          </div>
        </div>

        {/* Updates List */}
        <div className="md:col-span-3">
          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <div
                key={update.id}
                className={`bg-white rounded-lg shadow p-6 ${
                  !update.read ? 'border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {update.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {update.date}
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{update.title}</h3>
                <p className="text-gray-600 mb-4">{update.content}</p>

                <div className="flex items-center space-x-4">
                  <button className="text-sm text-blue-600 hover:underline">
                    Read More
                  </button>
                  {!update.read && (
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredUpdates.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No updates found</p>
              </div>
            )}

            {/* Load More */}
            {filteredUpdates.length > 0 && (
              <div className="text-center mt-6">
                <button className="text-blue-600 hover:underline">
                  Load More Updates
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerUpdates;