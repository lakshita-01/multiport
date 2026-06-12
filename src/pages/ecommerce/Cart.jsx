import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  useEffect(() => { if (user) fetchCart(); }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/ecommerce/cart');
      setCartItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, qty) => {
    if (qty < 1) return;
    try {
      await api.put(`/api/ecommerce/cart/${itemId}`, { quantity: qty });
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/api/ecommerce/cart/${itemId}`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const total = cartItems.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);

  const handleCheckout = async () => {
    if (!shippingAddress) { alert('Please enter shipping address'); return; }
    if (!sameAsShipping && !billingAddress) { alert('Please enter billing address'); return; }
    setProcessingPayment(true);
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'Pulses Store',
        description: 'Purchase Order',
        handler: async (response) => {
          try {
            await api.post('/api/ecommerce/orders', {
              total_amount: total,
              shipping_address: shippingAddress,
              billing_address: sameAsShipping ? shippingAddress : billingAddress,
              razorpay_order_id: response.razorpay_order_id || null,
              razorpay_payment_id: response.razorpay_payment_id || null,
              items: cartItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })),
            });
            alert('Order placed successfully!');
            navigate('/ecommerce');
          } catch (err) {
            alert('Order processing failed: ' + err.message);
          }
        },
        prefill: { email: user.email },
        theme: { color: '#2563eb' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => alert('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!user) { navigate('/auth'); return null; }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading cart...</div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <button onClick={() => navigate('/ecommerce')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    : <ShoppingCart className="w-12 h-12 text-white" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-2xl font-bold text-green-600">₹{item.price} / kg</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center transition">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold">{item.quantity} kg</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-gray-800">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>Free</span></div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
                  <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter your shipping address" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="sameAddr" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} className="mr-2" />
                  <label htmlFor="sameAddr" className="text-sm text-gray-700">Billing address same as shipping</label>
                </div>
                {!sameAsShipping && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address *</label>
                    <textarea value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter billing address" />
                  </div>
                )}
              </div>
              <button onClick={handleCheckout} disabled={processingPayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                {processingPayment ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">Secure payment powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
