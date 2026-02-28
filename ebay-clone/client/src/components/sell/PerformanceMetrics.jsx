import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PerformanceMetrics = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [salesData, setSalesData] = useState([]);
  const [viewsData, setViewsData] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const generateData = () => {
      const data = [];
      const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
      
      for (let i = 0; i < days; i++) {
        data.push({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          sales: Math.floor(Math.random() * 1000) + 500,
          views: Math.floor(Math.random() * 5000) + 1000
        });
      }
      
      return data.reverse();
    };

    const data = generateData();
    setSalesData(data);
    setViewsData(data);
  }, [timeframe]);

  return (
    <div className="space-y-8">
      {/* Timeframe Selector */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setTimeframe('week')}
          className={`px-4 py-2 rounded-lg ${
            timeframe === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setTimeframe('month')}
          className={`px-4 py-2 rounded-lg ${
            timeframe === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setTimeframe('quarter')}
          className={`px-4 py-2 rounded-lg ${
            timeframe === 'quarter'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Quarter
        </button>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Sales Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Views Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Listing Views</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold mt-2">$12,345</p>
          <p className="text-sm text-green-600 mt-1">+15.3% vs last period</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold mt-2">234</p>
          <p className="text-sm text-green-600 mt-1">+8.7% vs last period</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold mt-2">3.2%</p>
          <p className="text-sm text-green-600 mt-1">+0.5% vs last period</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;