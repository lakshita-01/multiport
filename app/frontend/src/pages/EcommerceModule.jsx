import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { ShoppingBag, ArrowLeft, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import axios from 'axios';
import { toast } from 'sonner';
import useRazorpay from 'react-razorpay';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

function EcommerceHome() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/ecommerce/products`);
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/ecommerce/cart`, { withCredentials: true });
      setCart(response.data.items || []);
    } catch (error) {
      console.log('Cart fetch error');
    }
  };

  const addToCart = async (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { product_id: product.id, quantity: 1 }];
    }

    try {
      await axios.post(`${API}/ecommerce/cart`, newCart, { withCredentials: true });
      setCart(newCart);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Please login first');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      <header className="bg-white border-b border-emerald-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="back-to-home"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-slate-900">E-Commerce Store</h1>
            </div>
            <Button
              onClick={() => navigate('/ecommerce/cart')}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Premium Quality Pulses</h2>
          <p className="text-lg text-slate-600 mb-6">Fresh and organic pulses delivered to your doorstep</p>
          
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-lg"
              data-testid="product-search"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6" data-testid="products-grid">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-6 bg-white hover:shadow-xl card-hover" data-testid={`product-card-${product.id}`}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-slate-400" />
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
                {product.stock > 0 ? (
                  <Badge className="bg-green-100 text-green-700">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <Button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-testid={`add-to-cart-${product.id}`}
              >
                Add to Cart
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, productsRes] = await Promise.all([
        axios.get(`${API}/ecommerce/cart`, { withCredentials: true }),
        axios.get(`${API}/ecommerce/products`)
      ]);
      setCart(cartRes.data.items || []);
      setProducts(productsRes.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newCart = cart.map(item =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    try {
      await axios.post(`${API}/ecommerce/cart`, newCart, { withCredentials: true });
      setCart(newCart);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    const newCart = cart.filter(item => item.product_id !== productId);
    
    try {
      await axios.post(`${API}/ecommerce/cart`, newCart, { withCredentials: true });
      setCart(newCart);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = getProductDetails(item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          onClick={() => navigate('/ecommerce')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Button>

        <h2 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h2>

        {cart.length === 0 ? (
          <Card className="p-12 bg-white text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/ecommerce')} data-testid="continue-shopping">
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-8" data-testid="cart-items">
              {cart.map((item) => {
                const product = getProductDetails(item.product_id);
                if (!product) return null;
                
                return (
                  <Card key={item.product_id} className="p-6 bg-white" data-testid={`cart-item-${item.product_id}`}>
                    <div className="flex items-center gap-6">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                        <p className="text-slate-600">₹{product.price} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            data-testid={`decrease-${item.product_id}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold" data-testid={`quantity-${item.product_id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            data-testid={`increase-${item.product_id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right w-24">
                          <p className="text-lg font-bold text-slate-900">
                            ₹{(product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product_id)}
                          data-testid={`remove-${item.product_id}`}
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-slate-900">Total:</span>
                <span className="text-3xl font-bold text-emerald-600" data-testid="cart-total">
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>
              <Button
                onClick={() => navigate('/ecommerce/checkout')}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [Razorpay] = useRazorpay();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, productsRes] = await Promise.all([
        axios.get(`${API}/ecommerce/cart`, { withCredentials: true }),
        axios.get(`${API}/ecommerce/products`)
      ]);
      setCart(cartRes.data.items || []);
      setProducts(productsRes.data);
    } catch (error) {
      toast.error('Failed to load checkout data');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      // Create order
      const orderResponse = await axios.post(
        `${API}/ecommerce/orders`,
        { items: cart, shipping_address: shippingAddress },
        { withCredentials: true }
      );
      const order = orderResponse.data;

      // Create payment order
      const paymentOrderResponse = await axios.post(
        `${API}/payment/create-order`,
        {
          amount: Math.round(order.total_amount * 100), // Convert to paise
          currency: 'INR',
          order_type: 'ecommerce',
          reference_id: order.id
        },
        { withCredentials: true }
      );

      // Open Razorpay
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: paymentOrderResponse.data.amount,
        currency: 'INR',
        name: 'MultiVista E-Commerce',
        description: `Order #${order.order_number}`,
        order_id: paymentOrderResponse.data.id,
        handler: async (razorpayResponse) => {
          try {
            await axios.post(
              `${API}/payment/verify`,
              {
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                order_type: 'ecommerce',
                reference_id: order.id
              },
              { withCredentials: true }
            );
            toast.success('Order placed successfully!');
            navigate('/ecommerce/orders');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone
        },
        theme: {
          color: '#059669'
        }
      };

      if (Razorpay) {
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      } else {
        toast.error('Payment system not available. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to process order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          onClick={() => navigate('/ecommerce/cart')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>

        <h2 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Shipping Address</h3>
            <form onSubmit={handleCheckout} className="space-y-4" data-testid="checkout-form">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  data-testid="shipping-name"
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  data-testid="shipping-address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    data-testid="shipping-city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    data-testid="shipping-state"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    required
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    data-testid="shipping-pincode"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    data-testid="shipping-phone"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-testid="place-order-button"
              >
                Place Order (₹{calculateTotal().toFixed(2)})
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            <div className="space-y-4">
              {cart.map((item) => {
                const product = products.find(p => p.id === item.product_id);
                if (!product) return null;
                
                return (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {product.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-900">
                      ₹{(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-600">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/ecommerce/orders`, { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          onClick={() => navigate('/ecommerce')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Button>

        <h2 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h2>

        <div className="space-y-6" data-testid="orders-list">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 bg-white" data-testid={`order-${order.id}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Order #{order.order_number}</h3>
                  <p className="text-sm text-slate-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.product_name} x {item.quantity}</span>
                    <span className="font-semibold">₹{item.total}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-emerald-600">₹{order.total_amount}</span>
              </div>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EcommerceModule() {
  return (
    <Routes>
      <Route path="/" element={<EcommerceHome />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
}
