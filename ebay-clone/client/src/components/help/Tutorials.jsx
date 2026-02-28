import React, { useState } from 'react';
import { PlayIcon, ClockIcon, UserIcon, TagIcon } from '@heroicons/react/outline';

const Tutorials = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tutorials' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'buying', name: 'Buying' },
    { id: 'selling', name: 'Selling' },
    { id: 'account', name: 'Account Management' }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'How to Create Your First Listing',
      description: 'Learn the step-by-step process of creating your first product listing',
      duration: '5:30',
      author: 'Seller Success Team',
      category: 'selling',
      level: 'Beginner',
      thumbnail: 'https://via.placeholder.com/300x200?text=Create+Listing'
    },
    {
      id: 2,
      title: 'Mastering Search Filters',
      description: 'Learn how to use advanced search filters to find exactly what you need',
      duration: '4:15',
      author: 'Buyer Guide',
      category: 'buying',
      level: 'Intermediate',
      thumbnail: 'https://via.placeholder.com/300x200?text=Search+Filters'
    },
    {
      id: 3,
      title: 'Understanding Auction Bidding',
      description: 'Tips and strategies for successful auction bidding',
      duration: '6:45',
      author: 'Auction Expert',
      category: 'buying',
      level: 'Intermediate',
      thumbnail: 'https://via.placeholder.com/300x200?text=Auction+Bidding'
    },
    {
      id: 4,
      title: 'Setting Up Your Seller Profile',
      description: 'Optimize your seller profile to attract more buyers',
      duration: '3:50',
      author: 'Seller Success Team',
      category: 'getting-started',
      level: 'Beginner',
      thumbnail: 'https://via.placeholder.com/300x200?text=Seller+Profile'
    },
    {
      id: 5,
      title: 'Managing Your Store Settings',
      description: 'Complete guide to customizing your store and managing settings',
      duration: '7:20',
      author: 'Store Manager',
      category: 'selling',
      level: 'Advanced',
      thumbnail: 'https://via.placeholder.com/300x200?text=Store+Settings'
    },
    {
      id: 6,
      title: 'Secure Payment Methods',
      description: 'Understanding payment options and staying safe',
      duration: '4:30',
      author: 'Security Team',
      category: 'account',
      level: 'Beginner',
      thumbnail: 'https://via.placeholder.com/300x200?text=Payments'
    }
  ];

  const filteredTutorials = activeCategory === 'all'
    ? tutorials
    : tutorials.filter(t => t.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Video Tutorials</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn how to make the most of our platform with these step-by-step video guides
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-2 rounded-full ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial) => (
          <div key={tutorial.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            <div className="relative group">
              <img
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <PlayIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">{tutorial.level}</span>
                <ClockIcon className="h-4 w-4 text-gray-400 ml-2" />
                <span className="text-xs text-gray-500">{tutorial.duration}</span>
              </div>
              
              <h3 className="font-bold mb-2 line-clamp-2">{tutorial.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutorial.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{tutorial.author}</span>
                </div>
                <button className="text-sm text-blue-600 hover:underline">
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Tutorial */}
      <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Don't see what you're looking for?</h2>
        <p className="text-gray-600 mb-4">Request a tutorial on a specific topic</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Request Tutorial
        </button>
      </div>
    </div>
  );
};

export default Tutorials;