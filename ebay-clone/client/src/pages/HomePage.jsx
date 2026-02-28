import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/buy/ProductGrid';
import CategoryList from '../components/buy/CategoryList';
import DailyDeals from '../components/buy/DailyDeals';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../utils/constants';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getProducts } = useProducts();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, recent] = await Promise.all([
          getProducts({ sort: 'views_desc', limit: 8 }),
          getProducts({ sort: 'createdAt_desc', limit: 8 })
        ]);
        
        setFeaturedProducts(featured.data.products);
        setRecentProducts(recent.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 px-8 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to eBay Clone
          </h1>
          <p className="text-xl mb-8">
            Buy and sell anything with anyone, anywhere in the world
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/search"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Shopping
            </Link>
            <Link
              to="/sell"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <CategoryList categories={categories} />
      </section>

      {/* Daily Deals */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Daily Deals</h2>
          <Link to="/daily-deals" className="text-blue-600 hover:underline">
            See all deals →
          </Link>
        </div>
        <DailyDeals />
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <Link to="/search?sort=views_desc" className="text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Recently Listed */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recently Listed</h2>
          <Link to="/search?sort=createdAt_desc" className="text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        <ProductGrid products={recentProducts} loading={loading} />
      </section>

      {/* Promotional Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Become a Seller Today!</h3>
        <p className="text-gray-600 mb-4">
          Join millions of sellers and start earning money by selling your items
        </p>
        <Link
          to="/sell"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Start Selling
        </Link>
      </div>
    </div>
  );
};

export default HomePage;