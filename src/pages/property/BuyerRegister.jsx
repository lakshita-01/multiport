import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { CheckCircle, AlertCircle, User, Mail, Phone, Home, MapPin, Maximize2, DollarSign, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import OTPVerification from '../../components/OTPVerification';

const steps = ['Personal Info', 'Property Needs', 'Review'];

const BuyerRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verified, setVerified] = useState({ email: false, phone: false });

  const [form, setForm] = useState({
    fullName:'', email:user?.email||'', phone:'',
    propertyType:'', preferredLocation:'', areaSize:'', budgetRange:'', additionalRequirements:'',
  });

  const types = ['Apartment','Villa','Plot','Commercial','Farm House','Penthouse'];
  const budgets = ['Under 50L','50L - 1Cr','1Cr - 2Cr','2Cr - 5Cr','5Cr+'];
  const typeEmoji = {Apartment:'🏢',Villa:'🏡',Plot:'🌿',Commercial:'🏪','Farm House':'🌾',Penthouse:'🏙️'};

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleVerified = t => setVerified(v=>({...v,[t]:true}));

  const next = () => {
    setError('');
    if (step===0 && (!form.fullName||!form.email||!form.phone)) { setError('Please fill all fields'); return; }
    if (step===0 && (!verified.email||!verified.phone)) { setError('Please verify email and phone first'); return; }
    if (step===1 && (!form.propertyType||!form.preferredLocation||!form.areaSize||!form.budgetRange)) { setError('Please fill all required fields'); return; }
    setStep(s=>s+1);
  };

  const submit = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/api/property/buyers',{
        full_name:form.fullName, email:form.email, phone:form.phone,
        property_type:form.propertyType, preferred_location:form.preferredLocation,
        area_size:form.areaSize, budget_range:form.budgetRange,
        additional_requirements:form.additionalRequirements,
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
        <p className="text-gray-500 mb-6">Please sign in to register as a buyer</p>
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
        <h2 className="text-3xl font-black text-gray-900 mb-2">Registration Successful!</h2>
        <p className="text-gray-500">Redirecting you to browse properties...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"/>
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
            <div className="absolute top-5 left-0 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
              style={{width:`${(step/(steps.length-1))*100}%`}}/>
            {steps.map((s,i)=>(
              <div key={i} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i<step?'step-done':i===step?'step-active':'step-inactive'
                }`}>
                  {i<step ? <CheckCircle className="w-5 h-5"/> : i+1}
                </div>
                <span className={`text-xs font-semibold ${i===step?'text-indigo-600':'text-gray-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8 animate-slide-up">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-gray-900">🏠 Buyer Registration</h1>
            <p className="text-gray-500 mt-1">Step {step+1} of {steps.length} — {steps[step]}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0"/>{error}
            </div>
          )}

          {/* Step 0 */}
          {step===0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><User className="w-4 h-4 text-indigo-400"/>Full Name *</label>
                <input className="field" placeholder="Enter your full name" value={form.fullName} onChange={e=>set('fullName',e.target.value)} required/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Mail className="w-4 h-4 text-indigo-400"/>Email Address *</label>
                <input className="field" type="email" placeholder="your@email.com" value={form.email} onChange={e=>set('email',e.target.value)} required/>
                <OTPVerification type="email" value={form.email} onVerified={handleVerified} label="Email"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Phone className="w-4 h-4 text-indigo-400"/>Phone Number *</label>
                <input className="field" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e=>set('phone',e.target.value)} required/>
                <OTPVerification type="phone" value={form.phone} onVerified={handleVerified} label="Phone"/>
              </div>
            </div>
          )}

          {/* Step 1 */}
          {step===1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {types.map(t=>(
                    <button key={t} type="button" onClick={()=>set('propertyType',t)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        form.propertyType===t ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                      }`}>
                      <div className="text-2xl mb-1">{typeEmoji[t]}</div>
                      <div className="text-xs font-semibold text-gray-700">{t}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-indigo-400"/>Preferred Location *</label>
                  <input className="field" placeholder="e.g., Mumbai, Delhi" value={form.preferredLocation} onChange={e=>set('preferredLocation',e.target.value)} required/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-indigo-400"/>Area / Size (sq.ft) *</label>
                  <input className="field" placeholder="e.g., 1000-1500" value={form.areaSize} onChange={e=>set('areaSize',e.target.value)} required/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-indigo-400"/>Budget Range *</label>
                <div className="flex flex-wrap gap-2">
                  {budgets.map(b=>(
                    <button key={b} type="button" onClick={()=>set('budgetRange',b)}
                      className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                        form.budgetRange===b ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}>{b}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-400"/>Additional Requirements</label>
                <textarea className="field" rows="3" placeholder="Any specific requirements, preferences, or notes..." value={form.additionalRequirements} onChange={e=>set('additionalRequirements',e.target.value)}/>
              </div>
            </div>
          )}

          {/* Step 2 — Review */}
          {step===2 && (
            <div className="animate-fade-in space-y-4">
              <div className="bg-indigo-50 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-indigo-900 mb-3">Review Your Details</h3>
                {[
                  {label:'Name', value:form.fullName},
                  {label:'Email', value:form.email},
                  {label:'Phone', value:form.phone},
                  {label:'Property Type', value:form.propertyType},
                  {label:'Location', value:form.preferredLocation},
                  {label:'Area', value:form.areaSize+' sq.ft'},
                  {label:'Budget', value:form.budgetRange},
                  ...(form.additionalRequirements?[{label:'Notes',value:form.additionalRequirements}]:[]),
                ].map(({label,value},i)=>(
                  <div key={i} className="flex justify-between text-sm border-b border-indigo-100 pb-2 last:border-0">
                    <span className="text-indigo-600 font-semibold">{label}</span>
                    <span className="text-gray-800 font-medium text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step>0 && (
              <button type="button" onClick={()=>setStep(s=>s-1)} className="btn btn-ghost py-3 px-6 rounded-xl">
                <ArrowLeft className="w-4 h-4"/>Back
              </button>
            )}
            {step<steps.length-1 ? (
              <button type="button" onClick={next} className="btn btn-primary flex-1 py-3 rounded-xl">
                Continue<ArrowRight className="w-4 h-4"/>
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={loading} className="btn btn-green flex-1 py-3 rounded-xl">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Registering...</> : <><CheckCircle className="w-4 h-4"/>Submit Registration</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerRegister;
