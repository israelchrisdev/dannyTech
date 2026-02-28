import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/solid';
import { ChatIcon, ThumbUpIcon, FlagIcon } from '@heroicons/react/outline';

const Feedback = () => {
  const [activeTab, setActiveTab] = useState('received');
  
  const feedback = {
    received: [
      {
        id: 1,
        from: 'buyer123',
        rating: 5,
        comment: 'Great seller! Item exactly as described, fast shipping.',
        date: '2 days ago',
        item: 'Vintage Camera',
        helpful: 12
      },
      {
        id: 2,
        from: 'collector456',
        rating: 4,
        comment: 'Good communication, item arrived on time. Would buy again.',
        date: '5 days ago',
        item: 'Antique Watch',
        helpful: 8
      },
      {
        id: 3,
        from: 'happycustomer',
        rating: 5,
        comment: 'Perfect transaction! Highly recommended.',
        date: '1 week ago',
        item: 'Designer Bag',
        helpful: 15
      }
    ],
    given: [
      {
        id: 4,
        to: 'seller789',
        rating: 5,
        comment: 'Excellent seller, item in perfect condition.',
        date: '3 days ago',
        item: 'Smartphone'
      },
      {
        id: 5,
        to: 'antiqueshop',
        rating: 4,
        comment: 'Good item, but shipping was a bit slow.',
        date: '1 week ago',
        item: 'Vintage Lamp'
      }
    ]
  };

  const ratings = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 12, percentage: 20 },
    { stars: 3, count: 3, percentage: 5 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Feedback</h1>

      {/* Overall Rating */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-start space-x-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">4.8</div>
            <div className="flex mt-2">{renderStars(5)}</div>
            <p className="text-sm text-gray-600 mt-1">Based on 60 ratings</p>
          </div>

          <div className="flex-1">
            {ratings.map((rating) => (
              <div key={rating.stars} className="flex items-center space-x-4 mb-2">
                <div className="flex items-center w-20">
                  <span className="text-sm">{rating.stars} stars</span>
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-yellow-400 rounded-full"
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`pb-4 px-1 ${
              activeTab === 'received'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Feedback Received
          </button>
          <button
            onClick={() => setActiveTab('given')}
            className={`pb-4 px-1 ${
              activeTab === 'given'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Feedback Given
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback[activeTab].map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {activeTab === 'received' ? item.from[0].toUpperCase() : item.to[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {activeTab === 'received' ? item.from : item.to}
                    </span>
                    <span className="text-sm text-gray-500">· {item.date}</span>
                  </div>
                  <div className="mt-1">{renderStars(item.rating)}</div>
                  <p className="mt-2 text-gray-700">{item.comment}</p>
                  <p className="mt-2 text-sm text-gray-500">Item: {item.item}</p>
                  
                  {activeTab === 'received' && (
                    <div className="flex items-center space-x-4 mt-4">
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                        <ThumbUpIcon className="h-4 w-4" />
                        <span>Helpful ({item.helpful})</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                        <ChatIcon className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                        <FlagIcon className="h-4 w-4" />
                        <span>Report</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Feedback Button */}
      {activeTab === 'given' && (
        <div className="mt-8 text-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Leave Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default Feedback;