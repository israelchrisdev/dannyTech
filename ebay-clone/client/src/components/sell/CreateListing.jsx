import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { categories } from '../../utils/constants';
import { XIcon, PhotographIcon } from '@heroicons/react/outline';

const CreateListing = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useProducts();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'NEW',
    quantity: 1,
    categoryId: '',
    type: 'FIXED_PRICE',
    startPrice: '',
    reservePrice: '',
    endTime: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setImages([...images, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    try {
      const productData = new FormData();
      productData.append('title', formData.title);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('condition', formData.condition);
      productData.append('quantity', formData.quantity);
      productData.append('categoryId', formData.categoryId);
      productData.append('type', formData.type);
      
      if (formData.type === 'AUCTION') {
        productData.append('startPrice', formData.startPrice);
        if (formData.reservePrice) {
          productData.append('reservePrice', formData.reservePrice);
        }
        productData.append('endTime', formData.endTime);
      }

      images.forEach(image => {
        productData.append('images', image);
      });

      const response = await createProduct(productData);
      navigate(`/product/${response.data.product.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Create New Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Photos</h2>
          
          <div className="grid grid-cols-5 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {images.length < 10 && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
                <PhotographIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  multiple
                />
              </label>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            Add up to 10 photos. First photo will be the main image.
          </p>
        </div>

        {/* Title */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength="200"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g., Vintage Rolex Watch in Excellent Condition"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.title.length}/200 characters
          </p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Describe your item in detail..."
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition <span className="text-red-500">*</span>
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </div>

        {/* Listing Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Listing Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="FIXED_PRICE"
                checked={formData.type === 'FIXED_PRICE'}
                onChange={handleChange}
                className="mr-2"
              />
              Fixed Price - Set a specific price for immediate purchase
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="AUCTION"
                checked={formData.type === 'AUCTION'}
                onChange={handleChange}
                className="mr-2"
              />
              Auction - Let buyers bid on your item
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="BEST_OFFER"
                checked={formData.type === 'BEST_OFFER'}
                onChange={handleChange}
                className="mr-2"
              />
              Best Offer - Accept offers from buyers
            </label>
          </div>
        </div>

        {/* Price Fields */}
        <div className="bg-white rounded-lg shadow p-6">
          {formData.type === 'FIXED_PRICE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0.00"
              />
            </div>
          )}

          {formData.type === 'AUCTION' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="startPrice"
                  value={formData.startPrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reserve Price ($) (Optional)
                </label>
                <input
                  type="number"
                  name="reservePrice"
                  value={formData.reservePrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum price you're willing to accept
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auction End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {formData.type === 'BEST_OFFER' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0.00"
              />
              <p className="text-sm text-gray-500 mt-1">
                Buyers can send offers below this price
              </p>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;