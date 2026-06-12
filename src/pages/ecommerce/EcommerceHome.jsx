import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Plus, Search, Star, Package, ArrowRight } from 'lucide-react';

const EcommerceHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [adding, setAdding] = useState(null);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => { fetchProducts(); fetchCategories(); if(user) fetchCart(); }, [user]);

  const fetchProducts = async () => {
    try { setLoading(true); const{data}=await api.get('/api/ecommerce/products'); setProducts(data||[]); }
    catch(e){console.error(e);} finally{setLoading(false);}
  };
  const fetchCategories = async () => {
    try { const{data}=await api.get('/api/ecommerce/categories'); setCategories(data||[]); } catch{}
  };
  const fetchCart = async () => {
    try { const{data}=await api.get('/api/ecommerce/cart'); setCartCount(data?.reduce((s,i)=>s+i.quantity,0)||0); } catch{}
  };

  const addToCart = async (productId) => {
    if(!user){ navigate('/auth'); return; }
    setAdding(productId);
    try {
      await api.post('/api/ecommerce/cart',{product_id:productId});
      setCartCount(c=>c+1);
      setAddedId(productId);
      setTimeout(()=>setAddedId(null),1500);
    } catch(e){alert(e.message);} finally{setAdding(null);}
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (!activeCat || p.category_id===activeCat || p.category_name===activeCat)
  );

  if(!user) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center px-4">
      <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md w-full border border-slate-200">
        <div className="h-16 w-16 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Premium Pulses Store</h2>
        <p className="text-slate-500 mb-8">Sign in to browse and shop quality pulses delivered to your door</p>
        <button onClick={()=>navigate('/auth')} className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all">
          Sign In to Shop <ArrowRight className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Header banner */}
      <header className="bg-white border-b border-emerald-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-7 w-7 text-emerald-600" />
              <h1 className="text-2xl font-bold text-slate-900">E-Commerce Store</h1>
            </div>
            <button onClick={()=>navigate('/ecommerce/cart')}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all">
              <ShoppingCart className="w-4 h-4"/>Cart
              {cartCount>0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search + Cart bar */}
        <div className="flex gap-3 mb-6 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pulses, grains..."
              className="field pl-11 w-full"/>
          </div>
        </div>

        {/* Category filters */}
        {categories.length>0 && (
          <div className="flex gap-2 mb-7 flex-wrap">
            <button onClick={()=>setActiveCat('')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${!activeCat?'border-emerald-500 bg-emerald-50 text-emerald-700':'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
              🌿 All Products
            </button>
            {categories.map(c=>(
              <button key={c._id||c.id} onClick={()=>setActiveCat(c.name)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${activeCat===c.name?'border-emerald-500 bg-emerald-50 text-emerald-700':'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i)=>(
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-44"/>
                <div className="p-4 space-y-2"><div className="skeleton h-4 w-3/4"/><div className="skeleton h-3 w-1/2"/><div className="skeleton h-8"/></div>
              </div>
            ))}
          </div>
        ) : filtered.length===0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((product,i)=>(
              <div key={product.id||product._id||i}
                className="card card-green overflow-hidden group animate-slide-up"
                style={{animationDelay:`${i*0.06}s`}}>
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center"
                      style={{background:`linear-gradient(135deg,${['#f59e0b','#10b981','#6366f1','#ec4899','#ef4444'][i%5]},${['#d97706','#059669','#4f46e5','#be185d','#dc2626'][i%5]})`}}>
                      <Package className="w-12 h-12 text-white/70"/>
                      <span className="text-white/70 text-sm mt-1">Premium Quality</span>
                    </div>
                  )}
                  {product.stock===0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl">Out of Stock</span>
                    </div>
                  )}
                  {product.category_name && (
                    <div className="absolute top-2 left-2">
                      <span className="tag tag-green text-xs">{product.category_name}</span>
                    </div>
                  )}
                  {/* Added animation */}
                  {addedId===(product.id||product._id) && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in">
                      <div className="bg-green-500 text-white rounded-2xl px-4 py-2 font-bold text-sm animate-bounce-in">✓ Added!</div>
                    </div>
                  )}
                </div>
                {/* Body */}
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_,i)=><Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400"/>)}
                    <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-black text-emerald-600">₹{product.price}<span className="text-sm font-medium text-gray-400">/kg</span></span>
                    <span className={`text-xs font-semibold ${product.stock>0?'text-green-600':'text-red-500'}`}>
                      {product.stock>0?`${product.stock}kg left`:'Sold Out'}
                    </span>
                  </div>
                  <button onClick={()=>addToCart(product.id||product._id)}
                    disabled={product.stock===0||adding===(product.id||product._id)}
                    className="btn btn-green w-full py-2.5 rounded-xl text-sm">
                    {adding===(product.id||product._id)
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Adding...</>
                      : <><Plus className="w-4 h-4"/>Add to Cart</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceHome;
