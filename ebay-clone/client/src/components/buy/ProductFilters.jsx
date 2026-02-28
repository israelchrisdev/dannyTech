import React, { useState } from 'react';
import { FilterIcon, XIcon } from '@heroicons/react/outline';
import { conditions, sortOptions } from '../../utils/constants';

const ProductFilters = ({ filters, onFilterChange, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  const applyPriceFilter = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border rounded-lg"
      >
        <FilterIcon className="h-5 w-5" />
        <span>Filters</span>
      </button>

      {/* Filter Sidebar */}
      <div className={`${isOpen ? 'fixed inset-0 z-50' : 'hidden lg:block lg:w-64'}`}>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Filter Panel */}
        <div className={`fixed lg:static top-0 left-0 h-full w-64 bg-white p-6 overflow-y-auto transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h3 className="font-bold">Filters</h3>
            <button onClick={() => setIsOpen(false)}>
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Sort */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Sort By</h4>
            <select
              value={filters.sort || 'createdAt_desc'}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Condition</h4>
            {conditions.map(condition => (
              <label key={condition.value} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  value={condition.value}
                  checked={filters.condition === condition.value}
                  onChange={(e) => onFilterChange({
                    ...filters,
                    condition: e.target.checked ? condition.value : ''
                  })}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{condition.label}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="flex space-x-2 mb-2">
              <input
                type="number"
                name="min"
                value={priceRange.min}
                onChange={handlePriceChange}
                placeholder="Min"
                className="w-1/2 border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="max"
                value={priceRange.max}
                onChange={handlePriceChange}
                placeholder="Max"
                className="w-1/2 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              Apply
            </button>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;