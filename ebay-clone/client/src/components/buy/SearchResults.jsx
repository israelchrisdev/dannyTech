import React from 'react';
import ProductGrid from './ProductGrid';
import Pagination from '../common/Pagination';

const SearchResults = ({ products, total, currentPage, totalPages, onPageChange, loading }) => {
  return (
    <div className="flex-1">
      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        {!loading && (
          <p>{total} results found</p>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid products={products} loading={loading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default SearchResults;