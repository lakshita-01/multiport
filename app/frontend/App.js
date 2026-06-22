import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import api from './src/lib/api';
import '@/App.css';
import Home from './pages/Home';
import PropertyModule from './pages/PropertyModule';
import MatrimonialModule from './pages/MatrimonialModule';
import EcommerceModule from './pages/EcommerceModule';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';

const AUTH_TOKEN_KEY = 'multivista_auth_token';

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-2xl font-semibold text-slate-700">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/*" element={<PropertyModule />} />
          <Route path="/matrimonial/*" element={<MatrimonialModule />} />
          <Route path="/ecommerce/*" element={<EcommerceModule />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
