import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { CheckIcon, XIcon } from '@heroicons/react/outline';

const BulkEdit = () => {
  const { getProducts, updateProduct } = useProducts();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ sellerId: 'current', limit: 50 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    try {
      await Promise.all(selectedProducts.map(productId =>
        updateProduct(productId, { [bulkAction]: bulkValue })
      ));
      
      // Refresh products
      fetchProducts();
      setSelectedProducts([]);
      setBulkAction('');
      setBulkValue('');
    } catch (error) {
      console.error('Error updating products:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold">Bulk Edit Listings</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select multiple listings to edit them at once
        </p>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="p-4 bg-gray-50 border-b flex items-center space-x-4">
          <span className="text-sm font-medium">
            {selectedProducts.length} items selected
          </span>
          
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="">Select action</option>
            <option value="price">Update Price</option>
            <option value="quantity">Update Quantity</option>
            <option value="condition">Update Condition</option>
          </select>

          {bulkAction && (
            <>
              {bulkAction === 'condition' ? (
                <select
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm"
                >
                  <option value="">Select condition</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              ) : (
                <input
                  type="number"
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  placeholder="Enter value"
                  className="border rounded-lg px-3 py-1 text-sm w-32"
                />
              )}

              <button
                onClick={handleBulkUpdate}
                className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
              >
                Apply
              </button>
            </>
          )}

          <button
            onClick={() => setSelectedProducts([])}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Product List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className="rounded text-blue-600"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded text-blue-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                    <span className="text-sm font-medium">{product.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">${product.price}</td>
                <td className="px-6 py-4 text-sm">{product.quantity}</td>
                <td className="px-6 py-4 text-sm">{product.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkEdit;