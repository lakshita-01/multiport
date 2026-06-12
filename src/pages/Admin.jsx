import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { Heart, ShoppingCart, TrendingUp, Plus, Edit2, Trash2, X, Package, CheckCircle, Home } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ buyers: 0, sellers: 0, properties: 0, matrimonialProfiles: 0, orders: 0, totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'products') { fetchProducts(); fetchCategories(); }
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'profiles') fetchProfiles();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const data = await api.get('/api/admin/stats');
      setStats(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    const { data } = await api.get('/api/ecommerce/products');
    setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await api.get('/api/ecommerce/categories');
    setCategories(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await api.get('/api/ecommerce/orders/all');
    setOrders(data || []);
  };

  const fetchProfiles = async () => {
    const { data } = await api.get('/api/matrimonial/profiles/all');
    setProfiles(data || []);
  };

  const openProductForm = (product = null) => {
    setEditingProduct(product);
    setProductForm(product
      ? { name: product.name, description: product.description || '', price: product.price, stock: product.stock, category_id: product.category_id || '', image_url: product.image_url || '' }
      : { name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
    setShowProductForm(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...productForm, price: parseFloat(productForm.price), stock: parseInt(productForm.stock), category_id: productForm.category_id || null, image_url: productForm.image_url || null };
      if (editingProduct) await api.put(`/api/ecommerce/products/${editingProduct.id}`, payload);
      else await api.post('/api/ecommerce/products', payload);
      setShowProductForm(false);
      fetchProducts();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/api/ecommerce/products/${id}`);
    fetchProducts();
  };

  const updateProfileStatus = async (id, status) => {
    await api.patch(`/api/matrimonial/profiles/${id}/status`, { status });
    fetchProfiles();
  };

  const updateOrderStatus = async (id, order_status) => {
    await api.patch(`/api/ecommerce/orders/${id}/status`, { order_status });
    fetchOrders();
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-lg font-semibold text-slate-600">Loading dashboard...</div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'profiles', label: 'Matrimonial', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
          <p className="text-gray-600">Logged in as {user?.email}</p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition ${activeTab === id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Property Module</h3>
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Buyers:</span><span className="font-bold">{stats.buyers}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Sellers:</span><span className="font-bold">{stats.sellers}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Properties:</span><span className="font-bold">{stats.properties}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Matrimonial Module</h3>
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Total Profiles:</span><span className="font-bold">{stats.matrimonialProfiles}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Est. Revenue:</span><span className="font-bold text-green-600">₹{(stats.matrimonialProfiles * 500).toLocaleString()}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">E-Commerce Module</h3>
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Total Orders:</span><span className="font-bold">{stats.orders}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Revenue:</span><span className="font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white md:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Total Platform Revenue</h3>
                    <p className="text-blue-100">Combined revenue from all modules</p>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-12 h-12 mb-2 ml-auto" />
                    <p className="text-4xl font-bold">₹{(stats.totalRevenue + stats.matrimonialProfiles * 500).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => navigate('/property')} className="bg-blue-100 text-blue-700 px-6 py-4 rounded-lg font-semibold hover:bg-blue-200 transition">Manage Properties</button>
                <button onClick={() => setActiveTab('profiles')} className="bg-pink-100 text-pink-700 px-6 py-4 rounded-lg font-semibold hover:bg-pink-200 transition">Manage Profiles</button>
                <button onClick={() => setActiveTab('products')} className="bg-green-100 text-green-700 px-6 py-4 rounded-lg font-semibold hover:bg-green-200 transition">Manage Products</button>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
              <button onClick={() => openProductForm()} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition">
                <Plus className="w-4 h-4" />Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                    <button onClick={() => setShowProductForm(false)}><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={saveProduct} className="space-y-4">
                    <input placeholder="Product Name *" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows="2" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" placeholder="Price (₹) *" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                      <input type="number" placeholder="Stock (kg) *" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <select value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Select Category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input placeholder="Image URL (optional)" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    <div className="flex gap-3">
                      <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                        {saving ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}
                      </button>
                      <button type="button" onClick={() => setShowProductForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>{['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.length === 0
                    ? <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products yet.</td></tr>
                    : products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4"><div className="font-semibold text-gray-800">{p.name}</div><div className="text-sm text-gray-500 truncate max-w-xs">{p.description}</div></td>
                        <td className="px-6 py-4 text-gray-600">{p.category_name || '—'}</td>
                        <td className="px-6 py-4 font-semibold text-green-600">₹{p.price}/kg</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.stock > 0 ? `${p.stock} kg` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openProductForm(p)} className="text-blue-600 hover:text-blue-700 p-1"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders Management</h2>
            <div className="space-y-4">
              {orders.length === 0
                ? <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">No orders yet.</div>
                : orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                      <div>
                        <p className="font-bold text-gray-800">Order #{order.id.slice(0, 8)}...</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                        <div className="flex gap-2 mt-2 justify-end flex-wrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.payment_status}
                          </span>
                          <select value={order.order_status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1">
                            {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2"><strong>Ship to:</strong> {order.shipping_address}</p>
                    {order.items?.filter(Boolean).length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Items:</p>
                        {order.items.filter(Boolean).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm text-gray-600">
                            <span>{item.name} × {item.quantity} kg</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Matrimonial Profiles */}
        {activeTab === 'profiles' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Matrimonial Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.length === 0
                ? <div className="col-span-3 bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">No profiles yet.</div>
                : profiles.map((profile) => (
                  <div key={profile.id} className="bg-white rounded-xl shadow-lg p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{profile.full_name}</h3>
                        <p className="text-sm text-gray-500">{profile.occupation} · {profile.city}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${profile.profile_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {profile.profile_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{profile.education} · {profile.religion}</p>
                    <p className="text-sm text-gray-600 mb-4">{profile.email}</p>
                    <div className="flex gap-2">
                      {profile.profile_status !== 'ACTIVE' && (
                        <button onClick={() => updateProfileStatus(profile.id, 'ACTIVE')}
                          className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm hover:bg-green-200">
                          <CheckCircle className="w-4 h-4" />Approve
                        </button>
                      )}
                      {profile.profile_status === 'ACTIVE' && (
                        <button onClick={() => updateProfileStatus(profile.id, 'SUSPENDED')}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm hover:bg-red-200">
                          <X className="w-4 h-4" />Suspend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
