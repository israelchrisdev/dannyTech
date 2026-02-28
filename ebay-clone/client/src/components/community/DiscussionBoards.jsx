import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChatIcon, UserGroupIcon, ClockIcon, ChevronRightIcon } from '@heroicons/react/outline';

const DiscussionBoards = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'General Discussion',
      description: 'Talk about anything related to buying and selling',
      topics: 1234,
      posts: 5678,
      lastPost: '2 hours ago'
    },
    {
      id: 2,
      name: 'Buying Help',
      description: 'Get help with your purchases, questions about items',
      topics: 892,
      posts: 3456,
      lastPost: '5 hours ago'
    },
    {
      id: 3,
      name: 'Selling Tips',
      description: 'Share tips and advice for successful selling',
      topics: 2341,
      posts: 7890,
      lastPost: '1 hour ago'
    },
    {
      id: 4,
      name: 'Shipping & Handling',
      description: 'Discuss shipping methods, costs, and best practices',
      topics: 567,
      posts: 2345,
      lastPost: '3 hours ago'
    },
    {
      id: 5,
      name: 'Payment Issues',
      description: 'Get help with payment problems and questions',
      topics: 432,
      posts: 1876,
      lastPost: '6 hours ago'
    },
    {
      id: 6,
      name: 'Feedback & Disputes',
      description: 'Discuss feedback system and resolve disputes',
      topics: 789,
      posts: 3456,
      lastPost: '4 hours ago'
    },
    {
      id: 7,
      name: 'International Trading',
      description: 'For discussions about cross-border transactions',
      topics: 345,
      posts: 1234,
      lastPost: '1 day ago'
    },
    {
      id: 8,
      name: 'Announcements',
      description: 'Official announcements and updates',
      topics: 123,
      posts: 456,
      lastPost: '2 days ago'
    }
  ]);

  const [recentTopics, setRecentTopics] = useState([
    {
      id: 1,
      title: 'How to handle a return request?',
      category: 'Selling Tips',
      author: 'seller123',
      replies: 12,
      views: 234,
      lastPost: '10 minutes ago'
    },
    {
      id: 2,
      title: 'Best shipping options for international buyers',
      category: 'Shipping & Handling',
      author: 'globaltrader',
      replies: 8,
      views: 156,
      lastPost: '25 minutes ago'
    },
    {
      id: 3,
      title: 'Payment not showing up in my account',
      category: 'Payment Issues',
      author: 'newuser',
      replies: 5,
      views: 89,
      lastPost: '1 hour ago'
    },
    {
      id: 4,
      title: 'Tips for taking better product photos',
      category: 'Selling Tips',
      author: 'photopro',
      replies: 15,
      views: 345,
      lastPost: '2 hours ago'
    },
    {
      id: 5,
      title: 'Buyer wants to cancel order',
      category: 'General Discussion',
      author: 'seller456',
      replies: 7,
      views: 123,
      lastPost: '3 hours ago'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Discussion Boards</h1>
        <p className="text-gray-600 mt-1">Join the conversation with millions of buyers and sellers</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Search discussions..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold mb-4">Categories</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/community/category/${category.id}`}
                className="block p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{category.topics.toLocaleString()} topics</span>
                      <span>{category.posts.toLocaleString()} posts</span>
                      <span className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Last post {category.lastPost}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Topics */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold mb-4">Recent Topics</h2>
            <div className="space-y-4">
              {recentTopics.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/community/topic/${topic.id}`}
                  className="block hover:bg-gray-50 p-2 rounded"
                >
                  <h3 className="font-medium text-sm">{topic.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    in {topic.category} by {topic.author}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{topic.replies} replies</span>
                    <span>{topic.views} views</span>
                    <span>{topic.lastPost}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/community/recent"
              className="block text-center text-sm text-blue-600 mt-4 hover:underline"
            >
              View all recent topics →
            </Link>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold mb-4">Statistics</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Topics:</span>
                <span className="font-medium">12,345</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posts:</span>
                <span className="font-medium">45,678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Members:</span>
                <span className="font-medium">89,012</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Newest Member:</span>
                <span className="font-medium">newuser123</span>
              </div>
            </div>
          </div>

          {/* Start New Topic Button */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Start New Topic
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionBoards;