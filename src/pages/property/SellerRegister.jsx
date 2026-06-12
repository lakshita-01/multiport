import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import OTPVerification from '../../components/OTPVerification';

const SellerRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verified, setVerified] = useState({ email: false, phone: false });

  const [sellerData, setSellerData] = useState({ fullName: '', email: user?.email || '', phone: '' });
  const [propertyData, setPropertyData] = useState({
    propertyType: '', location: '', areaSize: '', sellingPrice: '', description: '',
  });
  const [imageUrls, setImageUrls] = useState('');
  const [videoUrls, setVideoUrls] = useState('');

  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Farm House', 'Penthouse'];
  const handleVerified = (type) => setVerified((v) => ({ ...v, [type]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!verified.email || !verified.phone) {
      setError('Please verify both email and phone before submitting');
      return;
    }
    setLoading(true);
    try {
      const { data: seller } = await api.post('/api/property/sellers', {
        full_name: sellerData.fullName, email: sellerData.email, phone: sellerData.phone,
      });
      await api.post('/api/property/properties', {
        seller_id: seller.id,
        property_type: propertyData.propertyType,
        location: propertyData.location,
        area_size: propertyData.areaSize,
        selling_price: parseFloat(propertyData.sellingPrice),
        description: propertyData.description,
        image_urls: imageUrls ? imageUrls.split('\n').map((u) => u.trim()).filter(Boolean) : [],
        video_urls: videoUrls ? videoUrls.split('\n').map((u) => u.trim()).filter(Boolean) : [],
      });
      setSuccess(true);
      setTimeout(() => navigate('/property/browse'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Listed Successfully!</h2>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Registration & Property Listing</h1>
          <p className="text-gray-600 mb-8">Register and list your property for sale</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" value={sellerData.fullName} onChange={(e) => setSellerData({ ...sellerData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" value={sellerData.email} onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                  <OTPVerification type="email" value={sellerData.email} onVerified={handleVerified} label="Email" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" value={sellerData.phone} onChange={(e) => setSellerData({ ...sellerData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                  <OTPVerification type="phone" value={sellerData.phone} onVerified={handleVerified} label="Phone" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <select value={propertyData.propertyType} onChange={(e) => setPropertyData({ ...propertyData, propertyType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">Select Type</option>
                    {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input type="text" value={propertyData.location} onChange={(e) => setPropertyData({ ...propertyData, location: e.target.value })}
                    placeholder="City, Area" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area/Size (sq. ft.) *</label>
                  <input type="text" value={propertyData.areaSize} onChange={(e) => setPropertyData({ ...propertyData, areaSize: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
                  <input type="number" value={propertyData.sellingPrice} onChange={(e) => setPropertyData({ ...propertyData, sellingPrice: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Description *</label>
                  <textarea value={propertyData.description} onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
                    rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (one per line)</label>
                  <textarea value={imageUrls} onChange={(e) => setImageUrls(e.target.value)}
                    rows="3" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URLs (one per line)</label>
                  <textarea value={videoUrls} onChange={(e) => setVideoUrls(e.target.value)}
                    rows="2" placeholder="https://example.com/video1.mp4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {loading ? 'Processing...' : 'List Property'}
              </button>
              <button type="button" onClick={() => navigate('/property')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
