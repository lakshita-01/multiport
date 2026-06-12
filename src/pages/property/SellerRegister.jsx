import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { CheckCircle, AlertCircle, User, Mail, Phone, Home, MapPin, Maximize2, ArrowRight, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import OTPVerification from '../../components/OTPVerification';

const steps = ['Seller Info', 'Property Details', 'Media & Review'];
const types = ['Apartment','Villa','Plot','Commercial','Farm House','Penthouse'];
const typeEmoji = {Apartment:'🏢',Villa:'🏡',Plot:'🌿',Commercial:'🏪','Farm House':'🌾',Penthouse:'🏙️'};

const SellerRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verified, setVerified] = useState({ email: false, phone: false });
  const [seller, setSeller] = useState({ fullName:'', email:user?.email||'', phone:'' });
  const [property, setProperty] = useState({ propertyType:'', location:'', areaSize:'', sellingPrice:'', description:'' });
  const [imageUrls, setImageUrls] = useState('');
  const [videoUrls, setVideoUrls] = useState('');

  const setSel = (k,v) => setSeller(s=>({...s,[k]:v}));
  const setProp = (k,v) => setProperty(s=>({...s,[k]:v}));
  const handleVerified = t => setVerified(v=>({...v,[t]:true}));

  const next = () => {
    setError('');
    if (step===0){
      if (!seller.fullName||!seller.email||!seller.phone){ setError('Please fill all fields'); return; }
      if (!verified.email||!verified.phone){ setError('Please verify email and phone first'); return; }
    }
    if (step===1){
      if (!property.propertyType||!property.location||!property.areaSize||!property.sellingPrice||!property.description){ setError('Please fill all property details'); return; }
    }
    setStep(s=>s+1);
  };

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const { data: sellerDoc } = await api.post('/api/property/sellers',{ full_name:seller.fullName, email:seller.email, phone:seller.phone });
      await api.post('/api/property/properties',{
        seller_id: sellerDoc.id,
        property_type: property.propertyType,
        location: property.location,
        area_size: property.areaSize,
        selling_price: parseFloat(property.sellingPrice),
        description: property.description,
        image_urls: imageUrls ? imageUrls.split('\n').map(u=>u.trim()).filter(Boolean) : [],
        video_urls: videoUrls ? videoUrls.split('\n').map(u=>u.trim()).filter(Boolean) : [],
      });
      setSuccess(true);
      setTimeout(()=>navigate('/property/browse'),2000);
    } catch(e){ setError(e.message); } finally { setLoading(false); }
  };

  if (!user) return (
    <div className="min-h-screen dots-bg flex items-center justify-center px-4">
      <div className="card p-10 text-center max-w-sm w-full animate-scale-in">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Sign In Required</h2>
        <p className="text-gray-500 mb-6">Please sign in to list your property</p>
        <button onClick={()=>navigate('/auth')} className="btn btn-primary w-full py-3 rounded-xl">Sign In</button>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen dots-bg flex items-center justify-center px-4">
      <div className="card p-12 text-center max-w-md w-full animate-bounce-in">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-14 h-14 text-green-500"/>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Property Listed! 🎉</h2>
        <p className="text-gray-500">Your property is now live. Redirecting...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen dots-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"/>
            <div className="absolute top-5 left-0 h-0.5 bg-emerald-500 z-0 transition-all duration-500"
              style={{width:`${(step/(steps.length-1))*100}%`}}/>
            {steps.map((s,i)=>(
              <div key={i} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i<step?'bg-green-100 text-green-700':i===step?'bg-emerald-500 text-white':'bg-gray-100 text-gray-400'
                }`}>{i<step?<CheckCircle className="w-5 h-5"/>:i+1}</div>
                <span className={`text-xs font-semibold ${i===step?'text-emerald-600':'text-gray-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8 animate-slide-up">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-gray-900">🏡 List Your Property</h1>
            <p className="text-gray-500 mt-1">Step {step+1} of {steps.length} — {steps[step]}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0"/>{error}
            </div>
          )}

          {step===0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><User className="w-4 h-4 text-emerald-500"/>Full Name *</label>
                <input className="field" placeholder="Your full name" value={seller.fullName} onChange={e=>setSel('fullName',e.target.value)} required/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Mail className="w-4 h-4 text-emerald-500"/>Email Address *</label>
                <input className="field" type="email" value={seller.email} onChange={e=>setSel('email',e.target.value)} required/>
                <OTPVerification type="email" value={seller.email} onVerified={handleVerified} label="Email"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-500"/>Phone Number *</label>
                <input className="field" type="tel" placeholder="+91 9876543210" value={seller.phone} onChange={e=>setSel('phone',e.target.value)} required/>
                <OTPVerification type="phone" value={seller.phone} onVerified={handleVerified} label="Phone"/>
              </div>
            </div>
          )}

          {step===1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {types.map(t=>(
                    <button key={t} type="button" onClick={()=>setProp('propertyType',t)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${property.propertyType===t?'border-emerald-500 bg-emerald-50':'border-gray-200 hover:border-emerald-300'}`}>
                      <div className="text-2xl mb-1">{typeEmoji[t]}</div>
                      <div className="text-xs font-semibold text-gray-700">{t}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-500"/>Location *</label>
                  <input className="field" placeholder="City, Area" value={property.location} onChange={e=>setProp('location',e.target.value)} required/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-emerald-500"/>Area (sq.ft) *</label>
                  <input className="field" placeholder="e.g., 1200" value={property.areaSize} onChange={e=>setProp('areaSize',e.target.value)} required/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input className="field pl-8" type="number" placeholder="5000000" value={property.sellingPrice} onChange={e=>setProp('sellingPrice',e.target.value)} required/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea className="field" rows="4" placeholder="Describe the property — amenities, nearby facilities, condition..." value={property.description} onChange={e=>setProp('description',e.target.value)} required/>
              </div>
            </div>
          )}

          {step===2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><LinkIcon className="w-4 h-4 text-emerald-500"/>Image URLs (one per line)</label>
                <textarea className="field" rows="4" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" value={imageUrls} onChange={e=>setImageUrls(e.target.value)}/>
                <p className="text-xs text-gray-400 mt-1">Paste publicly accessible image URLs</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><LinkIcon className="w-4 h-4 text-emerald-500"/>Video URLs (one per line)</label>
                <textarea className="field" rows="2" placeholder="https://example.com/video.mp4" value={videoUrls} onChange={e=>setVideoUrls(e.target.value)}/>
              </div>
              {/* Summary */}
              <div className="bg-emerald-50 rounded-2xl p-5 space-y-2 border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-3">📋 Summary</h3>
                {[
                  {l:'Seller',v:seller.fullName},{l:'Type',v:property.propertyType},
                  {l:'Location',v:property.location},{l:'Area',v:property.areaSize+' sq.ft'},
                  {l:'Price',v:'₹'+parseInt(property.sellingPrice||0).toLocaleString()},
                ].map(({l,v},i)=>(
                  <div key={i} className="flex justify-between text-sm border-b border-emerald-100 pb-2 last:border-0">
                    <span className="text-emerald-700 font-semibold">{l}</span>
                    <span className="text-gray-800 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step>0 && <button type="button" onClick={()=>setStep(s=>s-1)} className="btn btn-ghost py-3 px-6 rounded-xl"><ArrowLeft className="w-4 h-4"/>Back</button>}
            {step<steps.length-1
              ? <button type="button" onClick={next} className="btn btn-green flex-1 py-3 rounded-xl">Continue<ArrowRight className="w-4 h-4"/></button>
              : <button type="button" onClick={submit} disabled={loading} className="btn btn-green flex-1 py-3 rounded-xl">
                  {loading?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Listing...</>:<><CheckCircle className="w-4 h-4"/>List Property</>}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
