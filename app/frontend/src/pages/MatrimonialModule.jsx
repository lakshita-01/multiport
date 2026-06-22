import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Heart, ArrowLeft, ThumbsUp, X, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import useRazorpay from 'react-razorpay';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'; // Will be replaced with actual key

function MatrimonialHome() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    if (!user) return;
    try {
      await axios.get(`${API}/matrimonial/my-profile`, { withCredentials: true });
      setHasProfile(true);
    } catch (error) {
      setHasProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <header className="bg-white border-b border-rose-200 shadow-sm">
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
              <Heart className="h-8 w-8 text-rose-600" />
              <h1 className="text-3xl font-bold text-slate-900">Matrimonial Site</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Find Your Perfect Match</h2>
          <p className="text-lg text-slate-600">Create your profile and discover compatible partners</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card
            onClick={() => navigate('/matrimonial/registration')}
            className="p-8 cursor-pointer hover:shadow-xl card-hover bg-white"
            data-testid="create-profile-card"
          >
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <User className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create Profile</h3>
              <p className="text-slate-600">Register and create your matrimonial profile</p>
            </div>
          </Card>

          <Card
            onClick={() => user && hasProfile ? navigate('/matrimonial/browse') : toast.error('Please create a profile first')}
            className="p-8 cursor-pointer hover:shadow-xl card-hover bg-white"
            data-testid="browse-profiles-card"
          >
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Browse Profiles</h3>
              <p className="text-slate-600">Swipe and find your perfect match</p>
            </div>
          </Card>

          <Card
            onClick={() => user && hasProfile ? navigate('/matrimonial/my-choices') : toast.error('Please create a profile first')}
            className="p-8 cursor-pointer hover:shadow-xl card-hover bg-white"
            data-testid="my-choices-card"
          >
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <ThumbsUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">My Choices</h3>
              <p className="text-slate-600">View profiles you've liked</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MatrimonialRegistration() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [Razorpay] = useRazorpay();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    date_of_birth: '',
    religion: '',
    caste: '',
    education: '',
    occupation: '',
    annual_income: '',
    height: '',
    weight: '',
    complexion: '',
    city: '',
    state: '',
    country: '',
    contact_number: '',
    email: '',
    profile_image: '',
    biodata_pdf: ''
  });

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      // Step 1: Create profile first (it will be inactive until payment)
      const response = await axios.post(`${API}/matrimonial/profiles`, formData, { withCredentials: true });
      const profileId = response.data.id;
      
      toast.success('Profile created! Please complete payment to activate.');

      // Step 2: Create payment order
      const orderResponse = await axios.post(
        `${API}/payment/create-order`,
        {
          amount: 50000, // Rs 500 in paise
          currency: 'INR',
          order_type: 'matrimonial',
          reference_id: profileId
        },
        { withCredentials: true }
      );

      // Step 3: Open Razorpay
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: 'INR',
        name: 'MultiVista Matrimonial',
        description: 'Registration Fee - ₹500',
        order_id: orderResponse.data.id,
        handler: async (razorpayResponse) => {
          try {
            // Step 4: Verify payment
            await axios.post(
              `${API}/payment/verify`,
              {
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                order_type: 'matrimonial',
                reference_id: profileId
              },
              { withCredentials: true }
            );
            toast.success('Payment successful! Your profile is pending admin approval.');
            navigate('/matrimonial');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact_number
        },
        theme: {
          color: '#e11d48'
        }
      };

      if (Razorpay) {
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      } else {
        toast.error('Payment system not available. Please try again.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to create profile';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Button
          onClick={() => navigate('/matrimonial')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="p-8 bg-white shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Matrimonial Registration</h2>
          <p className="text-slate-600 mb-6">Registration fee: ₹500</p>
          
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="matrimonial-registration-form">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="matrimonial-name"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger data-testid="matrimonial-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  data-testid="matrimonial-dob"
                />
              </div>
              <div>
                <Label htmlFor="religion">Religion *</Label>
                <Input
                  id="religion"
                  required
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  data-testid="matrimonial-religion"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="caste">Caste</Label>
                <Input
                  id="caste"
                  value={formData.caste}
                  onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                  data-testid="matrimonial-caste"
                />
              </div>
              <div>
                <Label htmlFor="education">Education *</Label>
                <Input
                  id="education"
                  required
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  data-testid="matrimonial-education"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="occupation">Occupation *</Label>
                <Input
                  id="occupation"
                  required
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  data-testid="matrimonial-occupation"
                />
              </div>
              <div>
                <Label htmlFor="annual_income">Annual Income *</Label>
                <Input
                  id="annual_income"
                  required
                  placeholder="e.g., 5-10 LPA"
                  value={formData.annual_income}
                  onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                  data-testid="matrimonial-income"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="height">Height *</Label>
                <Input
                  id="height"
                  required
                  placeholder="e.g., 5 feet 8 inches"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  data-testid="matrimonial-height"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight *</Label>
                <Input
                  id="weight"
                  required
                  placeholder="e.g., 70 kg"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  data-testid="matrimonial-weight"
                />
              </div>
              <div>
                <Label htmlFor="complexion">Complexion *</Label>
                <Input
                  id="complexion"
                  required
                  value={formData.complexion}
                  onChange={(e) => setFormData({ ...formData, complexion: e.target.value })}
                  data-testid="matrimonial-complexion"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  data-testid="matrimonial-city"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  data-testid="matrimonial-state"
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  data-testid="matrimonial-country"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contact_number">Contact Number *</Label>
                <Input
                  id="contact_number"
                  required
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  data-testid="matrimonial-phone"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="matrimonial-email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="profile_image">Profile Image</Label>
                <Input
                  id="profile_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile_image')}
                  data-testid="matrimonial-profile-image"
                />
              </div>
              <div>
                <Label htmlFor="biodata_pdf">Biodata PDF</Label>
                <Input
                  id="biodata_pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleImageUpload(e, 'biodata_pdf')}
                  data-testid="matrimonial-biodata"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700"
              data-testid="matrimonial-submit"
            >
              Proceed to Payment (₹500)
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function BrowseProfiles() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`${API}/matrimonial/profiles`, { withCredentials: true });
      setProfiles(response.data);
    } catch (error) {
      toast.error('Failed to fetch profiles');
    }
  };

  const handleSwipe = async (action) => {
    const currentProfile = profiles[currentIndex];
    try {
      await axios.post(
        `${API}/matrimonial/swipe`,
        { profile_id: currentProfile.id, action },
        { withCredentials: true }
      );
      
      if (action === 'like') {
        toast.success('Added to your choices!');
      }
      
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      toast.error('Failed to process swipe');
    }
  };

  if (!profiles.length || currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No more profiles to show</h2>
          <Button onClick={() => navigate('/matrimonial')} data-testid="back-to-matrimonial">
            Back to Matrimonial
          </Button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Button
          onClick={() => navigate('/matrimonial')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="p-8 bg-white shadow-xl" data-testid="profile-card">
          <div className="text-center mb-6">
            {currentProfile.profile_image ? (
              <img
                src={currentProfile.profile_image}
                alt={currentProfile.name}
                className="w-48 h-48 rounded-full mx-auto object-cover mb-4"
              />
            ) : (
              <div className="w-48 h-48 rounded-full mx-auto bg-slate-200 flex items-center justify-center mb-4">
                <User className="h-24 w-24 text-slate-400" />
              </div>
            )}
            <h2 className="text-3xl font-bold text-slate-900">{currentProfile.name}</h2>
            <p className="text-slate-600">{currentProfile.age} years old</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Occupation</p>
              <p className="font-semibold text-slate-900">{currentProfile.occupation}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Education</p>
              <p className="font-semibold text-slate-900">{currentProfile.education}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Location</p>
              <p className="font-semibold text-slate-900">{currentProfile.city}, {currentProfile.state}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Religion</p>
              <p className="font-semibold text-slate-900">{currentProfile.religion}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Height</p>
              <p className="font-semibold text-slate-900">{currentProfile.height}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Annual Income</p>
              <p className="font-semibold text-slate-900">{currentProfile.annual_income}</p>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            <Button
              onClick={() => handleSwipe('skip')}
              variant="outline"
              size="lg"
              className="h-16 w-16 rounded-full border-2 border-slate-300 hover:border-red-500 hover:bg-red-50"
              data-testid="swipe-left-button"
            >
              <X className="h-8 w-8 text-red-500" />
            </Button>
            <Button
              onClick={() => handleSwipe('like')}
              size="lg"
              className="h-16 w-16 rounded-full bg-rose-600 hover:bg-rose-700"
              data-testid="swipe-right-button"
            >
              <Heart className="h-8 w-8" />
            </Button>
          </div>
        </Card>

        <div className="text-center mt-6">
          <p className="text-slate-600">
            Profile {currentIndex + 1} of {profiles.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function MyChoices() {
  const navigate = useNavigate();
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    fetchChoices();
  }, []);

  const fetchChoices = async () => {
    try {
      const response = await axios.get(`${API}/matrimonial/my-choices`, { withCredentials: true });
      setChoices(response.data);
    } catch (error) {
      toast.error('Failed to fetch your choices');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Button
          onClick={() => navigate('/matrimonial')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h2 className="text-3xl font-bold text-slate-900 mb-8">My Choices</h2>

        <div className="grid md:grid-cols-3 gap-6" data-testid="my-choices-grid">
          {choices.map((profile) => (
            <Card key={profile.id} className="p-6 bg-white hover:shadow-xl card-hover" data-testid={`choice-card-${profile.id}`}>
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-slate-200 flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-slate-400" />
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">{profile.name}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-600">Age:</span> <span className="font-semibold">{profile.age} years</span></p>
                <p><span className="text-slate-600">Occupation:</span> <span className="font-semibold">{profile.occupation}</span></p>
                <p><span className="text-slate-600">Location:</span> <span className="font-semibold">{profile.city}</span></p>
                <p><span className="text-slate-600">Contact:</span> <span className="font-semibold">{profile.contact_number}</span></p>
                <p><span className="text-slate-600">Email:</span> <span className="font-semibold">{profile.email}</span></p>
              </div>
            </Card>
          ))}
        </div>

        {choices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">You haven't liked any profiles yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatrimonialModule() {
  return (
    <Routes>
      <Route path="/" element={<MatrimonialHome />} />
      <Route path="/registration" element={<MatrimonialRegistration />} />
      <Route path="/browse" element={<BrowseProfiles />} />
      <Route path="/my-choices" element={<MyChoices />} />
    </Routes>
  );
}
