import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { CameraIcon } from '@heroicons/react/outline';

const SellerStore = () => {
  const { user, updateProfile } = useAuth();
  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    banner: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const response = await api.get('/users/store');
      setStore(response.data.data.store);
      if (response.data.data.store) {
        setFormData({
          name: response.data.data.store.name || '',
          description: response.data.data.store.description || '',
          logo: null,
          banner: null
        });
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo);
    }
    if (formData.banner) {
      formDataToSend.append('banner', formData.banner);
    }

    try {
      const response = await api.patch('/users/store', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStore(response.data.data.store);
      setMessage('Store updated successfully!');
    } catch (error) {
      setMessage('Error updating store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Your Store</h1>

      {/* Store Preview */}
      {store && (
        <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            {store.banner ? (
              <img
                src={store.banner}
                alt="Store banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No banner image
              </div>
            )}
          </div>
          
          <div className="relative px-8 pb-6">
            <div className="absolute -top-12 left-8">
              <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <CameraIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-xl font-bold">{store.name || 'Your Store'}</h2>
              <p className="text-gray-600 mt-2">{store.description || 'No description yet.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Store Settings Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Store Settings</h2>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-600' 
              : 'bg-green-50 text-green-600'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your store name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Describe your store..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Logo
            </label>
            <input
              type="file"
              name="logo"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Banner
            </label>
            <input
              type="file"
              name="banner"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Store Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerStore;