import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/buy/ProductGrid';
import ProductFilters from '../components/buy/ProductFilters';
import Pagination from '../components/common/Pagination';

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'createdAt_desc',
    condition: '',
    minPrice: '',
    maxPrice: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const { getProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [slug, filters, pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts({
        category: slug,
        ...filters,
        page: pagination.page,
        limit: 20
      });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sort) => {
    setFilters(prev => ({ ...prev, sort }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex gap-8">
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4 capitalize">
          {slug} Category
        </h1>
        
        <ProductGrid products={products} loading={loading} />
        
        {!loading && products.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;