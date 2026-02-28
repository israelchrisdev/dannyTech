import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon, 
  PencilIcon,
  CameraIcon,
  StarIcon,
  ShoppingBagIcon,
  HeartIcon
} from '@heroicons/react/outline';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { getProducts } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    listings: 0,
    sales: 0,
    feedback: 0,
    rating: 0
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  useEffect(() => {
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    if (user) {
      try {
        const response = await getProducts({ sellerId: user.id });
        setStats({
          listings: response.data.products.length,
          sales: 24,
          feedback: 56,
          rating: 4.8
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your profile.</p>
        <Link to="/login" className="text-blue-600 hover:underline mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-12">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-300">
                    <UserIcon className="h-12 w-12 text-gray-500" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100">
                <CameraIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
              {user.bio && (
                <p className="mt-2 text-gray-700">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <ShoppingBagIcon className="h-6 w-6 mx-auto text-blue-600 mb-2" />
          <p className="text-2xl font-bold">{stats.listings}</p>
          <p className="text-sm text-gray-600">Listings</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <StarIcon className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">{stats.sales}</p>
          <p className="text-sm text-gray-600">Sales</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <HeartIcon className="h-6 w-6 mx-auto text-red-500 mb-2" />
          <p className="text-2xl font-bold">{stats.feedback}</p>
          <p className="text-sm text-gray-600">Feedback</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <StarIcon className="h-6 w-6 mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold">{stats.rating}</p>
          <p className="text-sm text-gray-600">Rating</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-600' 
              : 'bg-green-50 text-green-600'
          }`}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.location && (
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{user.location}</p>
                  </div>
                </div>
              )}
            </div>
            {user.bio && (
              <div>
                <p className="text-sm text-gray-500 mb-1">About</p>
                <p className="text-gray-900">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Listed a new item</p>
              <p className="text-sm text-gray-500">Vintage Camera</p>
            </div>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Received feedback</p>
              <p className="text-sm text-gray-500">5-star rating from buyer123</p>
            </div>
            <p className="text-sm text-gray-500">Yesterday</p>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Item sold</p>
              <p className="text-sm text-gray-500">Designer Watch</p>
            </div>
            <p className="text-sm text-gray-500">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;