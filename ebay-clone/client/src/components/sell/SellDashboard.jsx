import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/outline';
import CreateListing from './CreateListing';
import ListingForm from './ListingForm';
import BulkEdit from './BulkEdit';
import PromotionsManager from './PromotionsManager';
import SellerStore from './SellerStore';
import PerformanceMetrics from './PerformanceMetrics';

const SellDashboard = () => {
  const { user } = useAuth();
  const { getProducts } = useProducts();
  const [stats, setStats] = useState({
    totalSales: 0,
    activeListings: 0,
    totalViews: 0,
    averageRating: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          getProducts({ sellerId: user.id, limit: 5 }),
          // fetch orders
        ]);
        
        setStats({
          totalSales: 1250.75,
          activeListings: productsRes.data.products.length,
          totalViews: 3421,
          averageRating: 4.5
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your listings and track your performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={CurrencyDollarIcon}
          label="Total Sales"
          value={`$${stats.totalSales}`}
        />
        <StatCard
          icon={ShoppingBagIcon}
          label="Active Listings"
          value={stats.activeListings}
        />
        <StatCard
          icon={EyeIcon}
          label="Total Views"
          value={stats.totalViews}
        />
        <StatCard
          icon={StarIcon}
          label="Average Rating"
          value={stats.averageRating}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/sell/create"
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <ShoppingBagIcon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm">Create Listing</span>
          </Link>
          <Link
            to="/sell/bulk-edit"
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <ChartBarIcon className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <span className="text-sm">Bulk Edit</span>
          </Link>
          <Link
            to="/sell/promotions"
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <CurrencyDollarIcon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <span className="text-sm">Promotions</span>
          </Link>
          <Link
            to="/sell/store"
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <StarIcon className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <span className="text-sm">Manage Store</span>
          </Link>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<PerformanceMetrics />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/edit/:id" element={<ListingForm />} />
        <Route path="/bulk-edit" element={<BulkEdit />} />
        <Route path="/promotions" element={<PromotionsManager />} />
        <Route path="/store" element={<SellerStore />} />
      </Routes>
    </div>
  );
};

export default SellDashboard;