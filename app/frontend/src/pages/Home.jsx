import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Building2, Heart, ShoppingBag, LogOut, User, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'login' ? `${API}/auth/login` : `${API}/auth/register`;
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await axios.post(endpoint, payload, { withCredentials: true });
      onSuccess(res.data.user);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <Label>Name</Label>
              <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {mode === 'login' ? 'Sign In' : 'Register'}
          </Button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-blue-600 font-semibold">
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);

  const modules = [
    {
      title: 'Property Purchase',
      description: 'Find your dream property or list yours for sale',
      icon: Building2,
      path: '/property',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Matrimonial Site',
      description: 'Discover your perfect life partner',
      icon: Heart,
      path: '/matrimonial',
      color: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      title: 'E-Commerce',
      description: 'Shop premium quality pulses and grains',
      icon: ShoppingBag,
      path: '/ecommerce',
      color: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">MV</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">MultiVista</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  data-testid="logout-button"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAuth(true)}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="login-button"
              >
                Login
              </Button>
            )}
          </div>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={setUser} />}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Your All-in-One
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Digital Platform
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Access property listings, find life partners, and shop quality products — all in one place
          </p>
        </div>
      </section>

      {/* Module Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(module.path)}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl cursor-pointer card-hover border border-slate-200"
                  data-testid={`module-card-${module.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={`${module.iconBg} h-16 w-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110`}>
                    <Icon className={`h-8 w-8 ${module.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {module.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="mt-6">
                    <Button
                      className={`w-full bg-gradient-to-r ${module.color} text-white hover:opacity-90`}
                      data-testid={`explore-${module.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      Explore Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600">
            <p className="text-sm">© 2025 MultiVista. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
