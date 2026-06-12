import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CheckCircle, AlertCircle, Upload } from 'lucide-react';
import OTPVerification from '../../components/OTPVerification';

const ProfileRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [profileId, setProfileId] = useState(null);
  const [verified, setVerified] = useState({ email: false, phone: false });

  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    religion: '',
    caste: '',
    education: '',
    occupation: '',
    annualIncome: '',
    height: '',
    weight: '',
    complexion: '',
    city: '',
    state: '',
    country: '',
    contactNumber: '',
    email: user?.email || '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [biodata, setBiodata] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleVerified = (type) => setVerified((v) => ({ ...v, [type]: true }));

  const uploadFiles = async () => {
    let profileImageUrl = '';
    let biodataUrl = '';
    try {
      if (profileImage) {
        const fileName = `${Date.now()}-${profileImage.name}`;
        const { error } = await supabase.storage.from('matrimonial-profiles').upload(fileName, profileImage);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('matrimonial-profiles').getPublicUrl(fileName);
        profileImageUrl = urlData.publicUrl;
      }
      if (biodata) {
        const fileName = `${Date.now()}-${biodata.name}`;
        const { error } = await supabase.storage.from('matrimonial-biodatas').upload(fileName, biodata);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('matrimonial-biodatas').getPublicUrl(fileName);
        biodataUrl = urlData.publicUrl;
      }
      return { profileImageUrl, biodataUrl };
    } catch {
      throw new Error('Failed to upload files');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!verified.email || !verified.phone) {
      setError('Please verify both email and phone number before submitting');
      return;
    }

    setLoading(true);
    try {
      const { profileImageUrl, biodataUrl } = await uploadFiles();
      const { data: profile, error: profileError } = await supabase
        .from('matrimonial_profiles')
        .insert([{
          user_id: user.id,
          full_name: formData.fullName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          religion: formData.religion,
          caste: formData.caste,
          education: formData.education,
          occupation: formData.occupation,
          annual_income: formData.annualIncome,
          height: formData.height,
          weight: formData.weight,
          complexion: formData.complexion,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          contact_number: formData.contactNumber,
          email: formData.email,
          profile_image_url: profileImageUrl,
          biodata_url: biodataUrl,
          profile_status: 'PENDING',
        }])
        .select()
        .maybeSingle();

      if (profileError) throw profileError;
      setProfileId(profile.id);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setError('');
    setLoading(true);
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: 50000,
        currency: 'INR',
        name: 'Matrimonial Registration',
        description: 'Profile Registration Fee',
        handler: async function (response) {
          try {
            await supabase.from('matrimonial_payments').insert([{
              profile_id: profileId,
              amount: 500,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              payment_status: 'SUCCESS',
              payment_date: new Date().toISOString(),
            }]);
            await supabase.from('matrimonial_profiles').update({ profile_status: 'ACTIVE' }).eq('id', profileId);
            setStep(3);
          } catch {
            setError('Payment recorded but profile activation failed');
          }
        },
        prefill: { name: formData.fullName, email: formData.email, contact: formData.contactNumber },
        theme: { color: '#ec4899' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { setError('Payment failed. Please try again.'); setLoading(false); });
      rzp.open();
    } catch {
      setError('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please sign in to register</p>
          <button onClick={() => navigate('/auth')} className="bg-pink-600 text-white px-6 py-3 rounded-lg">Sign In</button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile Activated!</h2>
          <p className="text-gray-600 mb-6">Your payment was successful and your profile is now active.</p>
          <button onClick={() => navigate('/matrimonial/browse')} className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition">
            Browse Profiles
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Payment</h2>
          <p className="text-gray-600 mb-6">Your profile has been created. Please complete the payment of ₹500 to activate your profile.</p>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
          <div className="bg-pink-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Registration Fee</span>
              <span className="text-2xl font-bold text-pink-600">₹500</span>
            </div>
            <p className="text-sm text-gray-600">One-time payment for profile activation</p>
          </div>
          <button onClick={handlePayment} disabled={loading} className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50">
            {loading ? 'Processing...' : 'Pay ₹500 & Activate Profile'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-4">Secure payment powered by Razorpay</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Matrimonial Profile</h1>
          <p className="text-gray-600 mb-8">Fill in your details to create your profile</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <input type="text" name="religion" value={formData.religion} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                <input type="text" name="caste" value={formData.caste} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                <input type="text" name="annualIncome" value={formData.annualIncome} onChange={handleChange}
                  placeholder="e.g., 5-10 LPA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <input type="text" name="height" value={formData.height} onChange={handleChange}
                  placeholder="e.g., 5'8''"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <input type="text" name="weight" value={formData.weight} onChange={handleChange}
                  placeholder="e.g., 70 kg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
                <input type="text" name="complexion" value={formData.complexion} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
                <OTPVerification type="phone" value={formData.contactNumber} onVerified={handleVerified} label="Phone" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" required />
                <OTPVerification type="email" value={formData.email} onVerified={handleVerified} label="Email" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} className="hidden" id="profileImage" />
                  <label htmlFor="profileImage" className="cursor-pointer text-pink-600 hover:text-pink-700">
                    {profileImage ? profileImage.name : 'Click to upload profile image'}
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Biodata (PDF)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <input type="file" accept=".pdf" onChange={(e) => setBiodata(e.target.files[0])} className="hidden" id="biodata" />
                  <label htmlFor="biodata" className="cursor-pointer text-pink-600 hover:text-pink-700">
                    {biodata ? biodata.name : 'Click to upload biodata PDF'}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading}
                className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50">
                {loading ? 'Creating Profile...' : 'Create Profile & Proceed to Payment'}
              </button>
              <button type="button" onClick={() => navigate('/matrimonial')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileRegister;
