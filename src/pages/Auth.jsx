import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (isSignUp && password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccess('Account created! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally { setLoading(false); }
  };

  const perks = ['Free to use forever', 'OTP verified accounts', 'Secure JWT auth', '3 modules in one place'];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center px-16"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
        {/* Blobs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 animate-float" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10 animate-float" style={{ background: 'radial-gradient(circle, #ec4899, transparent)', animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Unified Portal</span>
          </div>

          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Your gateway to<br /><span className="gradient-text">everything you need</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Property, matrimony, and shopping — all in one secure platform built for modern India.
          </p>

          <ul className="space-y-4">
            {perks.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isSignUp ? 'Sign up to get started for free' : 'Sign in to your account'}
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
                <CheckCircle className="w-4 h-4" />{success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10" placeholder="your@email.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field pl-10" placeholder="••••••••" required />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up Free"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
