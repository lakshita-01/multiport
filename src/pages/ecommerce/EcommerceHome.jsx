import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Plus, Search } from 'lucide-react';

const EcommerceHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    fetchProducts();
    if (user) fetchCartCount();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/ecommerce/products');
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const { data } = await api.get('/api/ecommerce/cart');
      setCartCount(data?.reduce((s, i) => s + i.quantity, 0) || 0);
    } catch {}
  };

  const addToCart = async (productId) => {
    if (!user) { navigate('/auth'); return; }
    setAdding(productId);
    try {
      await api.post('/api/ecommerce/cart', { product_id: productId });
      setCartCount((c) => c + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(null);
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">E-Commerce Store</h2>
        <p className="text-gray-600 mb-8">Please sign in to shop</p>
        <button onClick={() => navigate('/auth')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Sign In</button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading products...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Pulses Store</h1>
            <p className="text-gray-600">Premium quality pulses delivered to your door</p>
          </div>
          <button onClick={() => navigate('/ecommerce/cart')}
            className="relative bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" /><span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="mb-8 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <div className="h-48 bg-gradient-to-r from-yellow-400 to-orange-500">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-20 h-20 text-white opacity-50" />
                  </div>
                )}
              </div>
              <div className="p-6">
                {product.category_name && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{product.category_name}</span>
                )}
                <h3 className="text-xl font-bold text-gray-800 mt-2 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₹{product.price}/kg</span>
                  <span className="text-sm text-gray-600">{product.stock > 0 ? `${product.stock} kg` : 'Out of stock'}</span>
                </div>
                <button onClick={() => addToCart(product.id)} disabled={product.stock === 0 || adding === product.id}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center">
                  <Plus className="w-5 h-5 mr-2" />
                  {adding === product.id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12"><p className="text-xl text-gray-600">No products found</p></div>
        )}
      </div>
    </div>
  );
};

export default EcommerceHome;
