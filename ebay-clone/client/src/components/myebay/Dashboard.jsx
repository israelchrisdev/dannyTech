import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import {
  HomeIcon,
  HeartIcon,
  ShoppingBagIcon,
  ClockIcon,
  StarIcon,
  SearchIcon,
  UserGroupIcon,
  MailIcon,
  BellIcon,
  UserIcon
} from '@heroicons/react/outline';
import WatchList from './WatchList';
import PurchaseHistory from './PurchaseHistory';
import BidsOffers from './BidsOffers';
import SavedSearches from './SavedSearches';
import Messages from './Messages';
import AccountSettings from './AccountSettings';

const Dashboard = () => {
  const navItems = [
    { path: '/myebay', icon: HomeIcon, label: 'Summary' },
    { path: '/myebay/watchlist', icon: HeartIcon, label: 'Watch List' },
    { path: '/myebay/purchases', icon: ShoppingBagIcon, label: 'Purchase History' },
    { path: '/myebay/bids', icon: ClockIcon, label: 'Bids/Offers' },
    { path: '/myebay/saved-searches', icon: SearchIcon, label: 'Saved Searches' },
    { path: '/myebay/messages', icon: MailIcon, label: 'Messages' },
    { path: '/myebay/settings', icon: UserIcon, label: 'Account Settings' }
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/myebay'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-8">
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/purchases" element={<PurchaseHistory />} />
          <Route path="/bids" element={<BidsOffers />} />
          <Route path="/saved-searches" element={<SavedSearches />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings/*" element={<AccountSettings />} />
        </Routes>
      </div>
    </div>
  );
};

const Summary = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">My eBay Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Recent Activity</p>
          <p className="text-2xl font-bold mt-2">12</p>
          <p className="text-sm text-gray-500 mt-1">Items in the last 30 days</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Watchlist</p>
          <p className="text-2xl font-bold mt-2">8</p>
          <p className="text-sm text-gray-500 mt-1">Items being watched</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Messages</p>
          <p className="text-2xl font-bold mt-2">3</p>
          <p className="text-sm text-gray-500 mt-1">Unread messages</p>
        </div>
      </div>

      {/* Recent Items */}
      <div>
        <h3 className="font-medium mb-4">Recently Viewed Items</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-2">
              <div className="bg-gray-200 h-32 rounded mb-2"></div>
              <p className="text-sm font-medium truncate">Sample Item {i}</p>
              <p className="text-sm text-gray-600">$99.99</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;