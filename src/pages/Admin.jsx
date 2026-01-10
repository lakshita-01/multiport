import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Users, Home, Heart, ShoppingCart, TrendingUp } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    buyers: 0,
    sellers: 0,
    properties: 0,
    matrimonialProfiles: 0,
    orders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      navigate('/auth');
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        buyersRes,
        sellersRes,
        propertiesRes,
        profilesRes,
        ordersRes,
      ] = await Promise.all([
        supabase.from('buyers').select('*', { count: 'exact', head: true }),
        supabase.from('sellers').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('matrimonial_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

      setStats({
        buyers: buyersRes.count || 0,
        sellers: sellersRes.count || 0,
        properties: propertiesRes.count || 0,
        matrimonialProfiles: profilesRes.count || 0,
        orders: ordersRes.data?.length || 0,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of all modules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Property Module</h3>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Buyers:</span>
                <span className="font-bold text-gray-800">{stats.buyers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sellers:</span>
                <span className="font-bold text-gray-800">{stats.sellers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Properties Listed:</span>
                <span className="font-bold text-gray-800">{stats.properties}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Matrimonial Module</h3>
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Profiles:</span>
                <span className="font-bold text-gray-800">{stats.matrimonialProfiles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registration Fee:</span>
                <span className="font-bold text-gray-800">₹500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Revenue:</span>
                <span className="font-bold text-green-600">₹{(stats.matrimonialProfiles * 500).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">E-Commerce Module</h3>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-bold text-gray-800">{stats.orders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white md:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Total Platform Revenue</h3>
                <p className="text-blue-100">Combined revenue from all modules</p>
              </div>
              <div className="text-right">
                <TrendingUp className="w-12 h-12 mb-2 ml-auto" />
                <p className="text-4xl font-bold">
                  ₹{(stats.totalRevenue + (stats.matrimonialProfiles * 500)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/property')}
              className="bg-blue-100 text-blue-700 px-6 py-4 rounded-lg font-semibold hover:bg-blue-200 transition"
            >
              Manage Properties
            </button>
            <button
              onClick={() => navigate('/matrimonial')}
              className="bg-pink-100 text-pink-700 px-6 py-4 rounded-lg font-semibold hover:bg-pink-200 transition"
            >
              Manage Profiles
            </button>
            <button
              onClick={() => navigate('/ecommerce')}
              className="bg-green-100 text-green-700 px-6 py-4 rounded-lg font-semibold hover:bg-green-200 transition"
            >
              Manage Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
